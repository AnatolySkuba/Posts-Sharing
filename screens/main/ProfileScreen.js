import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    FlatList,
    TouchableOpacity,
} from "react-native";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";
import {
    collection,
    query,
    where,
    onSnapshot,
    getDoc,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import Svg, { Path } from "react-native-svg";

import PhotoCamera from "../../component/PhotoCamera";
import {
    authChangeUserPhoto,
    authSignOutUser,
} from "../../redux/auth/authOperations";
import { firebase, db } from "../../firebase/config";
import { useDimensions } from "../../hooks/Dimensions";

const initialState = { photo: "" };

export default function ProfileScreen({ navigation }) {
    const { dimensions } = useDimensions();
    const [userPosts, setUserPosts] = useState([]);
    const [isCamera, setIsCamera] = useState(false);
    const [state, setState] = useState(initialState);
    const [isFingerUp, setIsFingerUp] = useState({});
    const { userPhoto, login, userId } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    function getUserPosts() {
        onSnapshot(
            query(collection(db, "posts"), where("userId", "==", userId)),
            (data) => {
                data.docs.map((doc) => isLiked(doc.id, userId));
                setUserPosts(
                    data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
                );
            }
        );
    }

    useEffect(() => {
        getUserPosts();
    }, []);

    async function startUploadPhotoToServer() {
        const photo = await uploadPhotoToServer();
        authChangeUserPhoto(dispatch, photo);
    }

    useEffect(() => {
        if (state.photo) {
            startUploadPhotoToServer();
        }
    }, [state.photo]);

    async function getCamera() {
        if (userPhoto) {
            setState({ photo: "" });
            authChangeUserPhoto(dispatch, (state.photo = ""));

            return;
        }

        const { status } = await Camera.requestCameraPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("", "Permission to show the camera was denied", [
                {
                    text: "App info",
                    onPress: () => Linking.openSettings(),
                },
                {
                    text: "Ok",
                },
            ]);

            return;
        }

        setIsCamera(true);
    }

    async function uploadPhotoToServer() {
        const response = await fetch(state.photo);
        const file = await response.blob();
        const uniquePhotoId = state.login + Date.now().toString();
        await firebase.storage().ref(`userPhoto/${uniquePhotoId}`).put(file);

        const processedPhoto = await firebase
            .storage()
            .ref("userPhoto")
            .child(uniquePhotoId)
            .getDownloadURL();

        return processedPhoto;
    }

    async function handleLike(postId, userId) {
        const likedPosts = await getDoc(doc(db, "posts", postId));
        if (likedPosts.data().likesQuantity.some((id) => id === userId)) {
            removeUserId(postId, userId);
        } else {
            addUserId(postId, userId);
        }
        isLiked(postId, userId);
    }

    async function isLiked(postId, userId) {
        const likedPosts = await getDoc(doc(db, "posts", postId));
        setIsFingerUp((prevState) => ({
            ...prevState,
            [postId]: likedPosts
                .data()
                .likesQuantity.some((id) => id === userId),
        }));
    }

    async function addUserId(postId, userId) {
        await updateDoc(doc(db, "posts", postId), {
            likesQuantity: arrayUnion(userId),
        });
    }

    async function removeUserId(postId, userId) {
        await updateDoc(doc(db, "posts", postId), {
            likesQuantity: arrayRemove(userId),
        });
    }

    if (userPosts) {
        userPosts.sort((x, y) => y.date - x.date);
        return (
            <View style={styles.container}>
                {isCamera ? (
                    <PhotoCamera
                        setState={setState}
                        setIsCamera={setIsCamera}
                    />
                ) : (
                    <>
                        <Image
                            source={require("../../assets/images/bg.jpg")}
                            style={{
                                ...styles.image,
                                width: dimensions.width,
                                height: dimensions.height * 1.07,
                            }}
                        />
                        <View style={styles.form}>
                            <View
                                style={{
                                    ...styles.cameraContainer,
                                    left: dimensions.width / 2 - 60,
                                }}
                            >
                                {userPhoto && (
                                    <Image
                                        source={{
                                            uri: userPhoto,
                                        }}
                                        style={styles.preview}
                                    />
                                )}
                                <TouchableOpacity
                                    onPress={getCamera}
                                    style={{
                                        ...styles.addPhotoContainer,
                                        borderColor: userPhoto
                                            ? "#BDBDBD"
                                            : "#FF6C00",
                                    }}
                                >
                                    <Feather
                                        style={
                                            userPhoto
                                                ? styles.resetPhoto
                                                : styles.addPhoto
                                        }
                                        name="plus"
                                        size={18}
                                    />
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity
                                onPress={() => authSignOutUser(dispatch)}
                            >
                                <Feather
                                    name="log-out"
                                    size={24}
                                    color="#BDBDBD"
                                    style={styles.logOut}
                                />
                            </TouchableOpacity>
                            <Text style={styles.title}>{login}</Text>
                            <FlatList
                                style={styles.postsContainer}
                                data={userPosts}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <>
                                        <View style={styles.postPhotoContainer}>
                                            <Image
                                                source={{ uri: item.photo }}
                                                style={styles.postPhoto}
                                            />
                                        </View>
                                        <Text style={styles.postName}>
                                            {item.postName}
                                        </Text>
                                        <View style={styles.postComment}>
                                            <View
                                                style={{
                                                    flexDirection: "row",
                                                    flex: 1,
                                                }}
                                            >
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        navigation.navigate(
                                                            "Comments",
                                                            {
                                                                postId: item.id,
                                                                photo: item.photo,
                                                            }
                                                        )
                                                    }
                                                >
                                                    {item.commentsQuantity ? (
                                                        <Svg
                                                            width={26}
                                                            height={26}
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <Path
                                                                d="M0 8.5C-0.00344086 9.81987 0.304932 11.1219 0.9 12.3C2.33904 15.1793 5.28109 16.9988 8.5 17C9.81987 17.0034 11.1219 16.6951 12.3 16.1L18 18L16.1 12.3C16.6951 11.1219 17.0034 9.81987 17 8.5C16.9988 5.28109 15.1793 2.33904 12.3 0.899998C11.1219 0.304929 9.81987 -0.00344328 8.5 -2.02948e-06H8C3.68419 0.238098 0.2381 3.68419 0 8V8.5Z"
                                                                fill="#FF6C00"
                                                            />
                                                        </Svg>
                                                    ) : (
                                                        <Feather
                                                            name="message-circle"
                                                            size={24}
                                                            color="rgba(189, 189, 189, 1)"
                                                            style={
                                                                styles.messageCircle
                                                            }
                                                        />
                                                    )}
                                                </TouchableOpacity>
                                                <Text
                                                    style={
                                                        styles.postCommentQuantity
                                                    }
                                                >
                                                    {item.commentsQuantity}
                                                </Text>
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        handleLike(
                                                            item.id,
                                                            item.userId
                                                        )
                                                    }
                                                >
                                                    <Feather
                                                        name="thumbs-up"
                                                        size={24}
                                                        color={
                                                            isFingerUp[item.id]
                                                                ? "#FF6C00"
                                                                : "rgba(189, 189, 189, 1)"
                                                        }
                                                        style={styles.thumbsUp}
                                                    />
                                                </TouchableOpacity>
                                                <Text
                                                    style={
                                                        styles.postCommentQuantity
                                                    }
                                                >
                                                    {item.likesQuantity.length}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    item.locality.latitude &&
                                                    navigation.navigate("Map", {
                                                        location: item.locality,
                                                    })
                                                }
                                            >
                                                <Feather
                                                    name="map-pin"
                                                    size={20}
                                                    color="rgba(189, 189, 189, 1)"
                                                />
                                            </TouchableOpacity>
                                            <Text style={styles.localityText}>
                                                {item.locality.name}
                                            </Text>
                                        </View>
                                    </>
                                )}
                            />
                        </View>
                    </>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
    image: {
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
    },
    logOut: { position: "absolute", top: 22, right: 0 },
    form: {
        position: "relative",
        marginTop: 147,
        height: "100%",
        backgroundColor: "#FFF",
        paddingHorizontal: 16,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
    },
    preview: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    cameraContainer: {
        flex: 1,
        position: "absolute",
        width: 120,
        height: 120,
        backgroundColor: "#F6F6F6",
        borderRadius: 16,
        top: -60,
    },
    addPhotoContainer: {
        position: "absolute",
        top: 81,
        right: -12.5,
        width: 25,
        height: 25,
        backgroundColor: "#FFF",
        borderColor: "#FF6C00",
        borderWidth: 1,
        justifyContent: "center",
        borderRadius: 13,
    },
    addPhoto: {
        textAlign: "center",
        color: "#FF6C00",
    },
    resetPhoto: {
        textAlign: "center",
        color: "#BDBDBD",
        transform: [{ rotate: "45deg" }],
    },
    title: {
        marginTop: 92,
        marginBottom: 33,
        textAlign: "center",
        fontWeight: "500",
        fontSize: 30,
        fontFamily: "Roboto-Medium",
        lineHeight: 35,
        letterSpacing: 0.01,
        color: "#212121",
    },
    postsContainer: {
        marginBottom: 130,
    },
    postContainer: {},
    postPhotoContainer: {
        height: 240,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        objectFit: "cover",
    },
    postPhoto: { width: "100%", height: "100%", borderRadius: 8 },
    postName: {
        marginTop: 8,
        fontWeight: "500",
        fontSize: 16,
        fontFamily: "Roboto-Medium",
        lineHeight: 19,
        color: "#212121",
    },
    postComment: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 11,
        marginBottom: 35,
    },
    messageCircle: {
        transform: [{ scaleX: -1 }, { scaleY: 1 }],
    },
    thumbsUp: { marginLeft: 27 },
    postCommentQuantity: {
        marginLeft: 9,
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#BDBDBD",
    },
    localityText: {
        marginLeft: 8,
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
});
