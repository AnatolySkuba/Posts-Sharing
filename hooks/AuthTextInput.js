import React, { useState } from "react";
import { TextInput, StyleSheet } from "react-native";

export default function AuthTextInput({
    name,
    placeholder,
    state,
    setState,
    setIsShowKeyboard,
    isShowPassword = true,
}) {
    const [isFocused, setIsFocused] = useState({
        login: false,
        password: false,
        [name]: false,
    });

    const handleInputFocus = (name, setIsShowKeyboard) => {
        setIsFocused({
            [name]: true,
        });
        setIsShowKeyboard(true);
    };

    const handleInputBlur = (name) => {
        setIsFocused({
            [name]: false,
        });
    };

    return (
        <TextInput
            placeholder={placeholder}
            value={state[name]}
            onChangeText={(value) =>
                setState((prevState) => ({
                    ...prevState,
                    [name]: value,
                }))
            }
            placeholderTextColor={"#BDBDBD"}
            secureTextEntry={!isShowPassword}
            onFocus={() => handleInputFocus(name, setIsShowKeyboard)}
            onBlur={() => handleInputBlur(name)}
            style={
                isFocused[name]
                    ? [styles.input, { borderColor: "#FF6C00" }]
                    : styles.input
            }
        />
    );
}

const styles = StyleSheet.create({
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
});
