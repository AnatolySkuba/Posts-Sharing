import React, { useState } from "react";
import {
    StyleSheet,
    View,
    ImageBackground,
    Text,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Alert,
} from "react-native";

const RegistrationScreen = () => {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [login, setLogin] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginHandler = (text) => setLogin(text);
    const emailHandler = (text) => setEmail(text);
    const passwordHandler = (text) => setPassword(text);

    const onLogin = () => {
        Alert.alert("Credentials", `${login} + ${password}`);
    };

    // console.log(Platform.OS, Platform);
    console.log(isShowKeyboard, new Date());

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("../../assets/images/bg.jpg")}
                resizeMode="cover"
                style={styles.image}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <View
                        style={{
                            ...styles.form,
                            marginBottom: isShowKeyboard ? 0 : 100,
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
                            style={styles.input}
                        />
                        <TextInput
                            value={password}
                            onChangeText={passwordHandler}
                            placeholder="Пароль"
                            secureTextEntry={true}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btn}
                            onPress={onLogin}
                        >
                            <Text style={styles.btnTitle}>
                                Зарегистрироваться
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={styles.btnLogin}
                            onPress={onLogin}
                        >
                            <Text style={styles.btnLoginText}>
                                Уже есть аккаунт? Войти
                            </Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 0,
    },
    form: {
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
