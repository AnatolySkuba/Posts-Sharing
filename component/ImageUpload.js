import React from "react";
import {
    Linking,
    TouchableOpacity,
    Text,
    Alert,
    StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImageUpload({ setState }) {
    async function pickImage() {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert("", "Permission show the media library was denied", [
                {
                    text: "App info",
                    onPress: () => Linking.openSettings(),
                },
                {
                    text: "Ok",
                },
            ]);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setState((prevState) => ({
                ...prevState,
                photo: result.assets[0].uri,
            }));
        }
    }

    return (
        <TouchableOpacity onPress={pickImage} style={styles.uploadPhoto}>
            <Text style={styles.uploadPhotoText}>Upload photo</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    uploadPhoto: {
        marginTop: 8,
        marginBottom: 33,
    },
    uploadPhotoText: {
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#BDBDBD",
    },
});
