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
    Alert,
} from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const RegistrationScreen = () => {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = (text) => setLogin(text);
    const emailHandler = (text) => setEmail(text);
    const passwordHandler = (text) => setPassword(text);

    const keyboardHide = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    };

    const onLogin = () => {
        Alert.alert("Credentials", `${login} + ${password}`);
    };

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

    // console.log(Platform.OS, Platform);
    console.log(isShowKeyboard, new Date());

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <TouchableWithoutFeedback onPress={keyboardHide}>
                <View style={styles.container}>
                    <Image
                        source={require("../../assets/images/bg.jpg")}
                        style={styles.image}
                    />
                    <View
                        style={{
                            ...styles.form,
                            bottom: isShowKeyboard ? -190 : 0,
                        }}
                    >
                        <Text style={styles.title}>Регистрация</Text>
                        <TextInput
                            value={login}
                            onChangeText={loginHandler}
                            placeholder="Логин"
                            onFocus={() => setIsShowKeyboard(true)}
                            style={styles.input}
                        />
                        <TextInput
                            value={email}
                            onChangeText={emailHandler}
                            placeholder="Адрес электронной почты"
                            onFocus={() => setIsShowKeyboard(true)}
                            style={styles.input}
                        />
                        <TextInput
                            value={password}
                            onChangeText={passwordHandler}
                            placeholder="Пароль"
                            onFocus={() => setIsShowKeyboard(true)}
                            secureTextEntry={true}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btn}
                            onPress={() => onLogin()}
                        >
                            <Text style={styles.btnTitle}>
                                Зарегистрироваться
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btnLogin}
                            onPress={() => onLogin()}
                        >
                            <Text style={styles.btnLoginText}>
                                Уже есть аккаунт? Войти
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        width: windowWidth,
        height: windowHeight * 1.07,
        position: "absolute",
        top: 0,
        left: 0,
    },
    form: {
        position: "absolute",
        bottom: 0,
        left: 0,
        width: windowWidth,

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
        lineHeight: 35,
        letterSpacing: 0.01,
    },
    input: {
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: "#E8E8E8",
        height: 50,
        backgroundColor: "#F6F6F6",
        borderRadius: 8,
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
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#1B4371",
    },
});

export default RegistrationScreen;
