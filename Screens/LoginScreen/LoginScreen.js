// import React, { useState } from "react";
// import {
//     StyleSheet,
//     View,
//     ImageBackground,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Platform,
//     KeyboardAvoidingView,
//     Keyboard,
//     TouchableWithoutFeedback,
//     Alert,
//     Dimensions,
// } from "react-native";

// const LoginScreen = () => {
//     const { width, height } = Dimensions.get("window");

//     const [isShowKeyboard, setIsShowKeyboard] = useState(false);
//     const [login, setLogin] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");

//     const loginHandler = (text) => setLogin(text);
//     const emailHandler = (text) => setEmail(text);
//     const passwordHandler = (text) => setPassword(text);

//     const keyboardHide = () => {
//         Keyboard.dismiss();
//         setIsShowKeyboard(false);
//     };

//     const onLogin = () => {
//         Alert.alert("Credentials", `${login} + ${password}`);
//     };

//     // console.log(Platform.OS, Platform);
//     console.log(width, height, isShowKeyboard, new Date());

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={styles.container}
//         >
//             <TouchableWithoutFeedback onPress={keyboardHide}>
//                 {/* <View style={styles.container}> */}
//                 <ImageBackground
//                     source={require("../../assets/images/bg.jpg")}
//                     resizeMode="cover"
//                     style={styles.image}
//                 >
//                     <View
//                         style={{
//                             ...styles.form,
//                             marginBottom: isShowKeyboard ? -200 : 0,
//                         }}
//                     >
//                         <Text style={styles.title}>Регистрация</Text>
//                         <TextInput
//                             value={login}
//                             onChangeText={loginHandler}
//                             placeholder="Логин"
//                             onFocus={() => setIsShowKeyboard(true)}
//                             style={styles.input}
//                         />
//                         <TextInput
//                             value={email}
//                             onChangeText={emailHandler}
//                             placeholder="Адрес электронной почты"
//                             onFocus={() => setIsShowKeyboard(true)}
//                             style={styles.input}
//                         />
//                         <TextInput
//                             value={password}
//                             onChangeText={passwordHandler}
//                             placeholder="Пароль"
//                             onFocus={() => setIsShowKeyboard(true)}
//                             secureTextEntry={true}
//                             style={styles.input}
//                         />
//                         <TouchableOpacity
//                             activeOpacity={0.8}
//                             style={styles.btn}
//                             onPress={() => onLogin()}
//                         >
//                             <Text style={styles.btnTitle}>
//                                 Зарегистрироваться
//                             </Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity
//                             activeOpacity={0.8}
//                             style={styles.btnLogin}
//                             onPress={() => onLogin()}
//                         >
//                             <Text style={styles.btnLoginText}>
//                                 Уже есть аккаунт? Войти
//                             </Text>
//                         </TouchableOpacity>
//                     </View>
//                 </ImageBackground>
//                 {/* </View> */}
//             </TouchableWithoutFeedback>
//         </KeyboardAvoidingView>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//     },
//     image: {
//         flex: 1,
//         justifyContent: "flex-end",
//     },
//     form: {
//         backgroundColor: "#FFF",
//         paddingHorizontal: 16,
//         borderTopLeftRadius: 25,
//         borderTopRightRadius: 25,
//     },
//     title: {
//         marginTop: 92,
//         marginBottom: 33,
//         textAlign: "center",
//         fontWeight: "500",
//         fontSize: 30,
//         lineHeight: 35,
//         letterSpacing: 0.01,
//     },
//     input: {
//         marginBottom: 16,
//         padding: 16,
//         borderWidth: 1,
//         borderColor: "#E8E8E8",
//         height: 50,
//         backgroundColor: "#F6F6F6",
//         borderRadius: 8,
//     },
//     btn: {
//         marginTop: 43,
//         paddingVertical: 16,
//         alignItems: "center",
//         // backgroundColor: Platform.OS === "ios" ? "transparent" : "#FF6C00",
//         backgroundColor: "#FF6C00",
//         borderRadius: 100,
//     },
//     btnTitle: {
//         fontWeight: "400",
//         fontSize: 16,
//         lineHeight: 19,
//         color: "#FFF",
//     },
//     btnLogin: {
//         marginTop: 16,
//         marginBottom: 78,
//         alignItems: "center",
//     },
//     btnLoginText: {
//         fontWeight: "400",
//         fontSize: 16,
//         lineHeight: 19,
//         color: "#1B4371",
//     },
// });

// export default LoginScreen;

import React from "react";
import {
    StyleSheet,
    Text,
    View,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
    TextInput,
    Image,
    Dimensions,
} from "react-native";

// const image = { uri: "../../assets/images/bg.jpg" };
const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

const LoginScreen = () => (
    <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
    >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={require("../../assets/images/bg.jpg")}
                    style={{
                        width: windowWidth,
                        height: windowHeight * 1.07,
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                />

                <Text style={styles.text}>Inside</Text>
                <TextInput style={styles.textInput} placeholder="qwerty" />
            </View>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        width: "100%",
        height: "100%",
    },
    text: {
        color: "white",
        fontSize: 42,
        lineHeight: 84,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#000000c0",
    },
    textInput: {
        color: "black",
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#fff",
    },
});

export default LoginScreen;
