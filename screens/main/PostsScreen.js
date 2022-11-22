import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function PostsScreen() {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Posts</Text>
                <Feather
                    name="log-out"
                    size={24}
                    color="#BDBDBD"
                    style={styles.logOut}
                />
            </View>
            <View style={styles.content}>
                <Text>PostsScreen</Text>
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
    content: { flex: 1, justifyContent: "center", backgroundColor: "#FFFFFF" },
});
