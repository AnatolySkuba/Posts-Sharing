import React from "react";
import { View, TouchableOpacity, Text, Button, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function ImageUpload({ setState }) {
    // const [status, requestPermission] =
    //     ImagePicker.useMediaLibraryPermissions();

    // if (!status) {
    //     // Media library permissions are still loading
    //     return <View />;
    // }

    // if (!status.granted) {
    //     // Media library permissions are not granted yet
    //     return (
    //         <View style={styles.container}>
    //             <Text style={{ textAlign: "center" }}>
    //                 We need your permission to show the media library
    //             </Text>
    //             <Button onPress={requestPermission} title="grant permission" />
    //         </View>
    //     );
    // }

    async function pickImage() {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("Permission show the media library was denied");
        }

        // No permissions request is necessary for launching the image library
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            // setImage(result.assets[0].uri);
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
