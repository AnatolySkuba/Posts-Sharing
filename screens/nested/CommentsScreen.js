import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    StyleSheet,
} from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import { useDimensions } from "../../hooks/Dimensions";
import { db } from "../../firebase/config";

export default function CommentsScreen({ navigation, route }) {
    const { dimensions } = useDimensions();
    const { login } = useSelector((state) => state.auth);
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [comment, setComment] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const { postId, photo } = route.params;

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

    function handleInputFocus() {
        setIsFocused(true);
        setIsShowKeyboard(true);
    }

    function handleInputBlur() {
        setIsFocused(false);
    }

    function keyboardHide() {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    }

    async function createComment() {
        await addDoc(collection(db, "posts", postId, "comments"), {
            comment,
            login,
        });
        setComment("");
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.containerScreen}
        >
            <TouchableWithoutFeedback onPress={keyboardHide}>
                <View style={styles.containerScreen}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Comments</Text>
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
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: photo }}
                                style={styles.image}
                            />
                        </View>
                        <View
                            style={{
                                ...styles.form,
                                width: dimensions.width,
                                paddingBottom: isShowKeyboard ? 150 : 100,
                            }}
                        >
                            <TextInput
                                value={comment}
                                onChangeText={(value) => setComment(value)}
                                placeholder="Comment..."
                                placeholderTextColor={"#BDBDBD"}
                                onFocus={() => handleInputFocus()}
                                onBlur={() => handleInputBlur()}
                                multiline={true}
                                style={{
                                    ...styles.input,
                                    width: dimensions.width - 32,
                                    borderBottomColor: isFocused
                                        ? "#FF6C00"
                                        : "#E8E8E8",
                                }}
                            />
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.btn}
                                onPress={() => createComment()}
                            >
                                <Feather
                                    name="arrow-up"
                                    size={20}
                                    color="#FFF"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerScreen: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: "#FFF",
    },
    header: {
        justifyContent: "flex-end",
        paddingBottom: 11,
        height: 88,
        backgroundColor: "#FFF",
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
    form: {
        position: "absolute",
        top: 188,
        left: 0,
        backgroundColor: "#FFF",
        paddingHorizontal: 16,
        paddingBottom: 100,
        justifyContent: "flex-end",
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
    input: {
        position: "absolute",
        marginLeft: 16,
        padding: 15,
        backgroundColor: "#F6F6F6",
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 100,
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
    btn: {
        width: 34,
        height: 34,
        marginVertical: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 34,
        backgroundColor: "#FF6C00",
    },
});
