import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from "react-native";
import { useDispatch } from "react-redux";
import { Camera } from "expo-camera";
import { Feather } from "@expo/vector-icons";

import PhotoCamera from "../../component/PhotoCamera";
import { firebase } from "../../firebase/config";
import AuthTextInput from "../../hooks/AuthTextInput";
import { useDimensions } from "../../hooks/Dimensions";
import { authSignUpUser } from "../../redux/auth/authOperations";

const initialState = {
    login: "",
    email: "",
    password: "",
    photo: "",
};

export default function RegistrationScreen({ navigation: { navigate } }) {
    const { dimensions } = useDimensions();
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isCamera, setIsCamera] = useState(false);
    const [state, setState] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

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

    function keyboardHide() {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    }

    async function getCamera() {
        if (state.photo) {
            setState((prevState) => ({
                ...prevState,
                photo: "",
            }));
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
        if (state.photo) {
            const response = await fetch(state.photo);
            const file = await response.blob();
            const uniquePhotoId = state.login + Date.now().toString();
            await firebase
                .storage()
                .ref(`userPhoto/${uniquePhotoId}`)
                .put(file);

            const processedPhoto = await firebase
                .storage()
                .ref("userPhoto")
                .child(uniquePhotoId)
                .getDownloadURL();

            return processedPhoto;
        } else {
            return "";
        }
    }

    async function onRegister() {
        if (isLoading) {
            return;
        }
        setIsLoading(true);
        const photo = await uploadPhotoToServer();
        await authSignUpUser(dispatch, state, photo);
        setState(initialState);
        setIsLoading(false);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={keyboardHide}>
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
                            <View
                                style={{
                                    ...styles.form,
                                    width: dimensions.width,
                                    bottom: isShowKeyboard ? -190 : -10,
                                }}
                            >
                                <View
                                    style={{
                                        ...styles.cameraContainer,
                                        left: dimensions.width / 2 - 60,
                                    }}
                                >
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
                                        style={{
                                            ...styles.addPhotoContainer,
                                            borderColor: state.photo
                                                ? "#BDBDBD"
                                                : "#FF6C00",
                                        }}
                                    >
                                        <Feather
                                            style={
                                                state.photo
                                                    ? styles.resetPhoto
                                                    : styles.addPhoto
                                            }
                                            name="plus"
                                            size={18}
                                        />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.title}>Sign up</Text>
                                <AuthTextInput
                                    name="login"
                                    placeholder="Login"
                                    state={state}
                                    setState={setState}
                                    setIsShowKeyboard={setIsShowKeyboard}
                                />
                                <AuthTextInput
                                    name="email"
                                    placeholder="Email Address"
                                    state={state}
                                    setState={setState}
                                    setIsShowKeyboard={setIsShowKeyboard}
                                />
                                <AuthTextInput
                                    name="password"
                                    placeholder="Password"
                                    state={state}
                                    setState={setState}
                                    setIsShowKeyboard={setIsShowKeyboard}
                                    isShowPassword={isShowPassword}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        setIsShowPassword(
                                            (prevState) => !prevState
                                        )
                                    }
                                    style={styles.showPasswordContainer}
                                >
                                    <Text style={styles.showPassword}>
                                        {isShowPassword ? "Hide" : "Show"}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.btn}
                                    onPress={() => onRegister()}
                                >
                                    {isLoading && (
                                        <ActivityIndicator
                                            size="small"
                                            color="white"
                                        />
                                    )}
                                    <Text style={styles.btnTitle}>Sign up</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.btnLogin}
                                    onPress={() => navigate("Login")}
                                >
                                    <Text style={styles.btnLoginText}>
                                        Already have an account? Login
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
        position: "absolute",
        bottom: 0,
        left: 0,
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
    showPasswordContainer: { position: "relative" },
    showPassword: {
        position: "absolute",
        top: -50,
        right: 32,
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#1B4371",
    },
    btn: {
        flexDirection: "row",
        marginTop: 43,
        paddingVertical: 16,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FF6C00",
        borderRadius: 100,
    },
    btnTitle: {
        marginLeft: 10,
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#FFF",
    },
    btnLogin: {
        marginTop: 16,
        marginBottom: 78,
        alignItems: "center",
    },
    btnLoginText: {
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#1B4371",
    },
});
