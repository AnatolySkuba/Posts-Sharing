import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
} from "react-native";
import { collection, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { Feather } from "@expo/vector-icons";

import { db } from "../../firebase/config";
import { authSignOutUser } from "../../redux/auth/authOperations";

export default function DefaultScreenPosts({ navigation }) {
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);

    function getAllPosts() {
        onSnapshot(collection(db, "posts"), (data) => {
            setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        });
    }

    console.log(22, posts);
    useEffect(() => {
        getAllPosts();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Posts</Text>
                <TouchableOpacity onPress={() => authSignOutUser(dispatch)}>
                    <Feather
                        name="log-out"
                        size={24}
                        color="#BDBDBD"
                        style={styles.logOut}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.content}>
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: item.photo }}
                                    style={styles.image}
                                />
                            </View>
                            <Text style={styles.name}>{item.postName}</Text>
                            <View style={styles.postComment}>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate("Comments", {
                                            postId: item.id,
                                            photo: item.photo,
                                        })
                                    }
                                >
                                    <Feather
                                        name="message-circle"
                                        size={24}
                                        color="rgba(189, 189, 189, 1)"
                                        style={styles.messageCircle}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.postCommentQuantity}>
                                    0
                                </Text>
                                <TouchableOpacity
                                    onPress={() =>
                                        item.locality.latitude &&
                                        navigation.navigate("Map", {
                                            location: item.locality,
                                        })
                                    }
                                >
                                    <Feather
                                        name="map-pin"
                                        size={20}
                                        color="rgba(189, 189, 189, 1)"
                                        style={styles.localityIcon}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.localityText}>
                                    {item.locality.name}
                                </Text>
                            </View>
                        </>
                    )}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center" },
    header: {
        justifyContent: "flex-end",
        paddingBottom: 11,
        height: 88,
        backgroundColor: "#FFFFFF",
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
    logOut: { position: "absolute", bottom: 11, right: 21 },
    content: {
        flex: 1,
        paddingHorizontal: 16,
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
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
    name: {
        marginTop: 8,
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
    postComment: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 11,
    },
    messageCircle: {
        transform: [{ scaleX: -1 }, { scaleY: 1 }],
    },
    postCommentQuantity: {
        marginLeft: 9,
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#BDBDBD",
    },
    localityIcon: { marginLeft: 53 },
    localityText: {
        marginLeft: 8,
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
});
