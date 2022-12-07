import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
    FlatList,
    KeyboardAvoidingView,
    Keyboard,
    StyleSheet,
} from "react-native";
import {
    collection,
    addDoc,
    onSnapshot,
    doc,
    updateDoc,
    increment,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";

import { useDimensions } from "../../hooks/Dimensions";
import { db } from "../../firebase/config";

export default function CommentsScreen({ navigation, route }) {
    const { dimensions } = useDimensions();
    const { userPhoto } = useSelector((state) => state.auth);
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [comment, setComment] = useState("");
    const [allComments, setAllComments] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const { postId, photo } = route.params;

    useEffect(() => {
        const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
            setIsShowKeyboard(true);
        });
        const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
            setIsShowKeyboard(false);
        });

        getAllComments();

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

    const today = new Date(Date.now());
    const date = `${
        today.toUTCString().split(" ")[1]
    } ${new Intl.DateTimeFormat("en-US", { month: "long" }).format(
        today
    )}, ${today.getFullYear()} |${today.toUTCString().slice(16, 22)}`;

    async function createComment() {
        if (comment) {
            await addDoc(collection(db, "posts", postId, "comments"), {
                comment,
                userPhoto,
                date,
            });
            setComment("");
            updateDoc(doc(db, "posts", postId), {
                commentsQuantity: increment(1),
            });
        }
        keyboardHide();
    }

    async function getAllComments() {
        onSnapshot(collection(db, "posts", postId, "comments"), (data) => {
            setAllComments(
                data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            );
        });
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
                        <View style={styles.commentsContainer}>
                            <SafeAreaView>
                                <FlatList
                                    data={allComments}
                                    renderItem={({ item }) => (
                                        <View
                                            style={{
                                                ...styles.commentContainer,
                                                flexDirection:
                                                    item.userPhoto === userPhoto
                                                        ? "row-reverse"
                                                        : "row",
                                            }}
                                        >
                                            <View
                                                style={
                                                    styles.userPhotoContainer
                                                }
                                            >
                                                <Image
                                                    source={{
                                                        uri: item.userPhoto,
                                                    }}
                                                    style={styles.userPhoto}
                                                />
                                            </View>
                                            <View
                                                style={{
                                                    ...styles.commentTextContainer,
                                                    width:
                                                        dimensions.width - 76,
                                                }}
                                            >
                                                <Text
                                                    style={styles.commentText}
                                                >
                                                    {item.comment}
                                                </Text>
                                                <Text
                                                    style={styles.commentDate}
                                                >
                                                    {item.date}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                    keyExtractor={(item) => item.id}
                                />
                            </SafeAreaView>
                            <View>
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
                                        size={24}
                                        color="#FFF"
                                    />
                                </TouchableOpacity>
                            </View>
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
        backgroundColor: "#FFF",
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    header: {
        justifyContent: "flex-end",
        paddingBottom: 11,
        height: 88,
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
    imageContainer: {
        marginTop: 32,
        marginBottom: 34,
        height: 240,
        backgroundColor: "#F6F6F6",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        objectFit: "cover",
    },
    image: { width: "100%", height: "100%", borderRadius: 8 },
    commentsContainer: { flex: 1, justifyContent: "space-between" },
    commentContainer: {
        marginBottom: 24,
        justifyContent: "space-between",
    },
    userPhotoContainer: {
        height: 28,
        width: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center",
        objectFit: "cover",
    },
    userPhoto: { width: "100%", height: "100%", borderRadius: 14 },
    commentTextContainer: {
        padding: 16,
        backgroundColor: "rgba(0, 0, 0, 0.03)",
    },
    commentText: {
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 13,
        lineHeight: 18,
        color: "#212121",
    },
    commentDate: {
        marginTop: 8,
        textAlign: "right",
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 10,
        lineHeight: 12,
        color: "#BDBDBD",
    },
    input: {
        padding: 15,
        backgroundColor: "#F6F6F6",
        borderWidth: 1,
        borderColor: "#E8E8E8",
        borderRadius: 30,
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
    btn: {
        position: "absolute",
        right: 14,
        bottom: 13,
        width: 34,
        height: 34,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        backgroundColor: "#FF6C00",
    },
});
