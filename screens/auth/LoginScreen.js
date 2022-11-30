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
    TouchableWithoutFeedback,
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    Alert,
} from "react-native";

import AuthTextInput from "../../hooks/AuthTextInput";
import { authSignInUser } from "../../redux/auth/authOperations";

const initialState = {
    email: null,
    password: null,
};

export default function ({ navigation }) {
    const [dimensions, setDimensions] = useState({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
    });
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [state, setState] = useState(initialState);

    const keyboardHide = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    };

    const onLogin = () => {
        authSignInUser(state);
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

    // console.log(Platform.OS, Platform);
    // console.log(state, isShowKeyboard, new Date());
    console.log(2, isShowKeyboard, dimensions.width);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={keyboardHide}>
                <View
                    // style={styles.container}
                    style={{
                        ...styles.container,
                        // width: dimensions.width,
                        // height: dimensions.height,
                    }}
                >
                    <Image
                        source={require("../../assets/images/bg.jpg")}
                        // style={styles.image}
                        style={{
                            ...styles.image,
                            width: dimensions.width,
                            height: dimensions.height * 1.07,
                        }}
                    />
                    {/* <SafeAreaView style={styles.container2}>
                        <ScrollView
                            contentContainerStyle={{ flex: 1 }}
                            style={styles.scrollView}
                        > */}
                    <View
                        style={{
                            ...styles.form,
                            width: dimensions.width,
                            bottom: isShowKeyboard ? -190 : -10,
                        }}
                    >
                        <Text style={styles.title}>Login</Text>
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
                            onPress={() => onLogin()}
                        >
                            <Text style={styles.btnTitle}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btnLogin}
                            onPress={() => navigation.navigate("Registration")}
                        >
                            <Text style={styles.btnLoginText}>
                                Don't have an account? Sign up
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* </ScrollView>
                    </SafeAreaView> */}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container2: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
    },
    scrollView: {
        backgroundColor: "pink",
        // marginHorizontal: 20,
        flex: 1,
    },
    container: {
        flex: 1,
        position: "relative",
    },
    image: {
        flex: 1,
        // width: width,
        // height: height * 1.07,
        position: "absolute",
        top: 0,
        left: 0,
    },
    form: {
        position: "absolute",
        bottom: 0,
        left: 0,
        // width: width,
        backgroundColor: "#FFF",
        paddingHorizontal: 16,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
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
