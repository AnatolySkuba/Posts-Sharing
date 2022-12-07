import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
} from "react-native";
import {
    collection,
    onSnapshot,
    getDoc,
    doc,
    updateDoc,
    arrayUnion,
    arrayRemove,
} from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

import { db } from "../../firebase/config";
import { authSignOutUser } from "../../redux/auth/authOperations";

export default function DefaultScreenPosts({ navigation }) {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    const [isFingerUp, setIsFingerUp] = useState({});
    const { userId } = useSelector((state) => state.auth);

    async function getAllPosts() {
        onSnapshot(collection(db, "posts"), (data) => {
            data.docs.map((doc) => isLiked(doc.id, userId));
            setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
    }

    useEffect(() => {
        getAllPosts();
    }, [userId]);

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

    if (posts) {
        posts.sort((x, y) => y.date - x.date);
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Posts</Text>
                    <TouchableOpacity onPress={() => authSignOutUser(dispatch)}>
                        <Feather
                            name="log-out"
                            size={24}
                            color="#BDBDBD"
                            style={styles.logOut}
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <FlatList
                        data={posts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <>
                                <View style={styles.imageContainer}>
                                    <Image
                                        source={{ uri: item.photo }}
                                        style={styles.image}
                                    />
                                </View>
                                <Text style={styles.name}>{item.postName}</Text>
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
                                                    style={styles.messageCircle}
                                                />
                                            )}
                                        </TouchableOpacity>
                                        <Text
                                            style={styles.postCommentQuantity}
                                        >
                                            {item.commentsQuantity}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() =>
                                                handleLike(item.id, item.userId)
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
                                            style={styles.postCommentQuantity}
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
                                            style={styles.localityIcon}
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
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center" },
    header: {
        justifyContent: "flex-end",
        paddingBottom: 11,
        height: 88,
        backgroundColor: "#FFFFFF",
        borderBottomColor: "rgba(0, 0, 0,0.1 )",
        borderBottomWidth: 1,
    },
    title: {
        textAlign: "center",
        fontWeight: "500",
        fontSize: 17,
        fontFamily: "Roboto-Medium",
        lineHeight: 22,
        letterSpacing: -0.408,
        color: "#212121",
    },
    logOut: { position: "absolute", bottom: 11, right: 21 },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
    imageContainer: {
        marginTop: 32,
        height: 240,
        backgroundColor: "#F6F6F6",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        objectFit: "cover",
    },
    image: { width: "100%", height: "100%", borderRadius: 8 },
    name: {
        marginTop: 8,
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
    postComment: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 11,
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
    localityIcon: { marginLeft: 53 },
    localityText: {
        marginLeft: 8,
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
});
