import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { useSelector, useDispatch } from "react-redux";

import PhotoCamera from "../../component/PhotoCamera";
import { authChangeUserPhoto } from "../../redux/auth/authOperations";
import { firebase } from "../../firebase/config";
import { useDimensions } from "../../hooks/Dimensions";

const initialState = { photo: "" };

export default function ProfileScreen({ navigation: { navigate } }) {
    const { dimensions } = useDimensions();
    const [isCamera, setIsCamera] = useState(false);
    const [state, setState] = useState(initialState);
    const { userPhoto, login } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

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

    return (
        <View style={styles.container}>
            {isCamera ? (
                <PhotoCamera setState={setState} setIsCamera={setIsCamera} />
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
                        <Text style={styles.title}>{login}</Text>
                    </View>
                </>
            )}
        </View>
    );
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
});
