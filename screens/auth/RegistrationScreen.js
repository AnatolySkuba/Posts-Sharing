import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
    Dimensions,
} from "react-native";
import { useDispatch } from "react-redux";
import { Camera, CameraType } from "expo-camera";
import { Feather } from "@expo/vector-icons";

import { authSignUpUser } from "../../redux/auth/authOperations";

const initialState = {
    login: null,
    email: null,
    password: null,
};

export default function RegistrationScreen({ navigation: { navigate } }) {
    const [dimensions, setDimensions] = useState({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    });
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [camera, setCamera] = useState(null);
    const [photo, setPhoto] = useState(null);
    const [state, setState] = useState(initialState);
    const [isFocused, setIsFocused] = useState({
        login: false,
        email: false,
        password: false,
    });
    const dispatch = useDispatch();

    const takePhoto = async () => {
        const photo = await camera.takePictureAsync();
        setPhoto(photo.uri);
        console.log(49, photo.uri);
    };

    const handleInputFocus = (textinput) => {
        setIsFocused({
            [textinput]: true,
        });
        setIsShowKeyboard(true);
    };

    const handleInputBlur = (textinput) => {
        setIsFocused({
            [textinput]: false,
        });
    };

    const keyboardHide = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    };

    const onRegister = () => {
        authSignUpUser(dispatch, state);
        setState(initialState);
    };

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsShowKeyboard(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsShowKeyboard(false);
        });

        const onChange = () => {
            const { width, height } = Dimensions.get("window");
            setDimensions({ width, height });
        };
        const dimensions = Dimensions.addEventListener("change", onChange);

        return () => {
            dimensions.remove();
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    console.log(98, isShowKeyboard, dimensions.width);

    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    // if (!permission) {
    //     // Camera permissions are still loading
    //     return <View />;
    // }

    // if (!permission.granted) {
    //     // Camera permissions are not granted yet
    //     return (
    //         <View style={styles.container}>
    //             <Text style={{ textAlign: "center" }}>
    //                 We need your permission to show the camera
    //             </Text>
    //             <Button onPress={requestPermission} title="grant permission" />
    //         </View>
    //     );
    // }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={keyboardHide}>
                <View style={styles.container}>
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
                            <Camera style={styles.camera} ref={setCamera}>
                                {/* {photo && ( */}
                                <View style={styles.photoContainer}>
                                    <Image
                                        source={{ uri: photo }}
                                        style={{ width: 100, height: 100 }}
                                    />
                                </View>
                                {/* )} */}
                                <TouchableOpacity
                                    onPress={takePhoto}
                                    style={styles.addPhotoContainer}
                                >
                                    <Feather
                                        style={styles.addPhoto}
                                        name="plus"
                                        size={13}
                                        color="#FF6C00"
                                    />
                                </TouchableOpacity>
                            </Camera>
                        </View>
                        <Text style={styles.title}>Sign up</Text>
                        <TextInput
                            value={state.login}
                            onChangeText={(value) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    login: value,
                                }))
                            }
                            placeholder="Login"
                            placeholderTextColor={"#BDBDBD"}
                            onFocus={() => handleInputFocus("login")}
                            onBlur={() => handleInputBlur("login")}
                            style={
                                isFocused.login
                                    ? [styles.input, { borderColor: "#FF6C00" }]
                                    : styles.input
                            }
                        />
                        <TextInput
                            value={state.email}
                            onChangeText={(value) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    email: value,
                                }))
                            }
                            placeholder="Email Address"
                            placeholderTextColor={"#BDBDBD"}
                            onFocus={() => handleInputFocus("email")}
                            onBlur={() => handleInputBlur("email")}
                            style={
                                isFocused.email
                                    ? [styles.input, { borderColor: "#FF6C00" }]
                                    : styles.input
                            }
                        />
                        <TextInput
                            value={state.password}
                            onChangeText={(value) =>
                                setState((prevState) => ({
                                    ...prevState,
                                    password: value,
                                }))
                            }
                            placeholder="Password"
                            placeholderTextColor={"#BDBDBD"}
                            onFocus={() => handleInputFocus("password")}
                            onBlur={() => handleInputBlur("password")}
                            secureTextEntry={!isShowPassword}
                            style={
                                isFocused.password
                                    ? [styles.input, { borderColor: "#FF6C00" }]
                                    : styles.input
                            }
                        ></TextInput>
                        <TouchableOpacity
                            onPress={() =>
                                setIsShowPassword((prevState) => !prevState)
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
    photoContainer: {
        position: "absolute",
        top: 0,
        left: 0,

        borderColor: "#F6F6F6",
        borderWidth: 1,
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
    camera: {
        flex: 1,
        width: 120,
        maxHeight: 120,
        backgroundColor: "transparent",
        borderRadius: 16,
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
        // backgroundColor: "#FFF",
        textAlign: "center",
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
    input: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        height: 50,
        backgroundColor: "#F6F6F6",
        borderRadius: 8,
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
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
        marginTop: 43,
        paddingVertical: 16,
        alignItems: "center",
        // backgroundColor: Platform.OS === "ios" ? "transparent" : "#FF6C00",
        backgroundColor: "#FF6C00",
        borderRadius: 100,
    },
    btnTitle: {
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
