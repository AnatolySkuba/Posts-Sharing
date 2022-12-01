import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Alert,
    Linking,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    StyleSheet,
} from "react-native";
import { useSelector } from "react-redux";
import { collection, addDoc } from "firebase/firestore";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

import { useDimensions } from "../../hooks/Dimensions";
import PhotoCamera from "../../component/PhotoCamera";
import ImageUpload from "../../component/ImageUpload";
import { firebase, db } from "../../firebase/config";
import Locality from "../../component/Location";

const initialState = {
    name: "",
    locality: "",
    photo: "",
};

export default function CreatePostsScreen({ navigation }) {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const { userId, login } = useSelector((state) => state.auth);
    const [state, setState] = useState(initialState);
    const [isCamera, setIsCamera] = useState(false);
    const { dimensions } = useDimensions();
    const [isFocused, setIsFocused] = useState({
        name: false,
        locality: false,
        photo: false,
    });

    useEffect(() => {
        navigation.setOptions({
            tabBarStyle: { height: 0 },
        });
    }, [navigation]);

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsShowKeyboard(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsShowKeyboard(false);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    function handleInputFocus(textInput) {
        setIsFocused({
            [textInput]: true,
        });
        setIsShowKeyboard(true);
    }

    function handleInputBlur(textInput) {
        setIsFocused({
            [textInput]: false,
        });
    }

    function keyboardHide() {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    }

    async function getCamera() {
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
        const uniquePhotoId = Date.now().toString();
        await firebase.storage().ref(`postImage/${uniquePhotoId}`).put(file);

        const processedPhoto = await firebase
            .storage()
            .ref("postImage")
            .child(uniquePhotoId)
            .getDownloadURL();

        return processedPhoto;
    }

    async function uploadPostToServer() {
        const photo = await uploadPhotoToServer();
        try {
            const createPost = await addDoc(collection(db, "posts"), {
                userId,
                userLogin: login,
                photo,
                postName: state.name,
                locality: state.locality,
            });
            console.log("Post written with ID: ", createPost.id);
        } catch (error) {
            console.error("Error adding post: ", error);
        }
    }

    function publish() {
        uploadPostToServer();
        navigation.navigate("DefaultScreen");
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.containerScreen}
        >
            <TouchableWithoutFeedback onPress={keyboardHide}>
                <View style={styles.containerScreen}>
                    {isCamera ? (
                        <PhotoCamera
                            setState={setState}
                            setIsCamera={setIsCamera}
                        />
                    ) : (
                        <>
                            <View style={styles.header}>
                                <Text style={styles.title}>Create post</Text>
                                <TouchableOpacity
                                    style={styles.arrowLeftContainer}
                                    onPress={() => navigation.goBack()}
                                >
                                    <Feather
                                        name="arrow-left"
                                        size={20}
                                        color="rgba(33, 33, 33, 0.8)"
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.container}>
                                <View style={styles.photo}>
                                    {state.photo && (
                                        <Image
                                            source={{
                                                uri: state.photo,
                                            }}
                                            style={styles.preview}
                                        />
                                    )}
                                    <TouchableOpacity
                                        onPress={getCamera}
                                        style={styles.photoIcon}
                                    >
                                        <Svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                        >
                                            <Path
                                                d="M11.9998 15.2C13.7671 15.2 15.1998 13.7673 15.1998 12C15.1998 10.2327 13.7671 8.79999 11.9998 8.79999C10.2325 8.79999 8.7998 10.2327 8.7998 12C8.7998 13.7673 10.2325 15.2 11.9998 15.2Z"
                                                fill="#BDBDBD"
                                            />
                                            <Path
                                                d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
                                                fill="#BDBDBD"
                                            />
                                        </Svg>
                                    </TouchableOpacity>
                                </View>
                                <ImageUpload setState={setState} />
                                <TextInput
                                    value={state.name}
                                    onChangeText={(value) =>
                                        setState((prevState) => ({
                                            ...prevState,
                                            name: value,
                                        }))
                                    }
                                    placeholder="Name..."
                                    placeholderTextColor={"#BDBDBD"}
                                    onFocus={() => handleInputFocus("name")}
                                    onBlur={() => handleInputBlur("name")}
                                    style={{
                                        ...styles.input,
                                        borderBottomColor: isFocused.name
                                            ? "#FF6C00"
                                            : "#E8E8E8",
                                    }}
                                />
                                <TextInput
                                    value={state.locality.name}
                                    onChangeText={(value) =>
                                        setState((prevState) => ({
                                            ...prevState,
                                            locality: { name: value },
                                        }))
                                    }
                                    placeholder="Locality..."
                                    placeholderTextColor={"#BDBDBD"}
                                    onFocus={() => handleInputFocus("locality")}
                                    onBlur={() => handleInputBlur("locality")}
                                    style={{
                                        ...styles.input,
                                        paddingLeft: 25,
                                        borderBottomColor: isFocused.locality
                                            ? "#FF6C00"
                                            : "#E8E8E8",
                                    }}
                                />
                                <Locality setState={setState} />
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={{
                                        ...styles.btn,
                                        backgroundColor:
                                            state.name &&
                                            state.locality &&
                                            state.photo
                                                ? "#FF6C00"
                                                : "#F6F6F6",
                                    }}
                                    onPress={() => publish()}
                                >
                                    <Text
                                        style={{
                                            ...styles.btnTitle,
                                            color:
                                                state.name &&
                                                state.locality &&
                                                state.photo
                                                    ? "#FFF"
                                                    : "#BDBDBD",
                                        }}
                                    >
                                        Publish
                                    </Text>
                                </TouchableOpacity>
                                {!isShowKeyboard && (
                                    <TouchableOpacity
                                        onPress={() => setState(initialState)}
                                        style={{
                                            ...styles.trash,
                                            left: dimensions.width / 2 - 35,
                                        }}
                                    >
                                        <Feather
                                            name="trash-2"
                                            size={20}
                                            color="rgba(218, 218, 218, 1)"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerScreen: { flex: 1 },
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
    arrowLeftContainer: { position: "absolute", bottom: 11, left: 20 },
    container: { flex: 1, paddingHorizontal: 17, backgroundColor: "#FFFFFF" },
    photo: {
        height: 240,
        marginTop: 32,
        borderRadius: 8,
        backgroundColor: "#F6F6F6",
        justifyContent: "center",
        alignItems: "center",
        objectFit: "cover",
    },
    photoIcon: {
        position: "absolute",
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    preview: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    input: {
        marginBottom: 16,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
    btn: {
        marginTop: 25,
        paddingVertical: 16,
        alignItems: "center",
        borderRadius: 100,
    },
    btnTitle: {
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
    },
    trash: {
        width: 70,
        height: 40,
        position: "absolute",
        bottom: 34,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F6F6F6",
        borderRadius: 20,
    },
});
