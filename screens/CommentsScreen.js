import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CommentsScreen() {
    return (
        <View style={styles.container}>
            <Text>CommentsScreen</Text>
            <View style={styles.remove}></View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: "center" },
    remove: {
        width: 100,
        height: 100,
        position: "absolute",
        bottom: -40,
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
});
