import React, { useEffect, useRef, useState } from "react";
import { Camera, CameraType } from "expo-camera";
import { shareAsync } from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Button,
    SafeAreaView,
    StyleSheet,
} from "react-native";

import { useDimensions } from "../hooks/Dimensions";

export default function PhotoCamera({ setState, setIsCamera }) {
    const cameraRef = useRef();
    const [permission, requestPermission] = Camera.useCameraPermissions();
    const [permissionResponse] = MediaLibrary.usePermissions();
    const [type, setType] = useState(CameraType.back);
    const [photo, setPhoto] = useState(null);
    const [isSavePhoto, setIsSavePhoto] = useState();
    const { dimensions } = useDimensions();

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View style={styles.container}>
                <Text style={{ textAlign: "center" }}>
                    We need your permission to show the camera
                </Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    async function takePhoto() {
        const options = {
            quality: 1,
            base64: true,
            exif: false,
        };
        const photo = await cameraRef.current.takePictureAsync(options);
        setPhoto(photo.uri);
    }

    function noPhoto() {
        setPhoto(undefined);
        setIsCamera(false);
    }

    function toggleCameraType() {
        setType((current) =>
            current === CameraType.back ? CameraType.front : CameraType.back
        );
    }

    if (photo) {
        function otherPhoto() {
            setPhoto(undefined);
        }

        function sharePhoto() {
            setState((prevState) => ({
                ...prevState,
                photo: photo,
            }));
            setIsCamera(false);
            shareAsync(photo).then(() => {
                setPhoto(undefined);
            });
        }

        function selectPhoto() {
            setState((prevState) => ({
                ...prevState,
                photo: photo,
            }));
            setIsCamera(false);
            setPhoto(undefined);
        }

        function savePhoto() {
            if (permissionResponse?.granted) {
                setState((prevState) => ({
                    ...prevState,
                    photo: photo,
                }));
                MediaLibrary.saveToLibraryAsync(photo).then(() => {
                    setIsCamera(false);
                    setPhoto(undefined);
                });
            } else {
                setIsSavePhoto(true);
            }
        }

        return (
            <SafeAreaView style={styles.containerScreen}>
                {isSavePhoto ? (
                    <View style={styles.container}>
                        <Text style={{ textAlign: "center" }}>
                            We need your permission to save the photo
                        </Text>
                        <Button
                            onPress={
                                MediaLibrary.usePermissions().requestPermission
                            }
                            title="grant permission"
                        />
                    </View>
                ) : (
                    <>
                        <Image
                            style={styles.preview}
                            // width={dimensions.width}
                            // height={(dimensions.width / 3) * 4}
                            source={{
                                uri: photo,
                            }}
                        />
                        <View style={styles.previewIcons}>
                            <TouchableOpacity
                                onPress={noPhoto}
                                style={styles.previewIcon}
                            >
                                <MaterialIcons
                                    name="no-photography"
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={otherPhoto}
                                style={styles.previewIcon}
                            >
                                <MaterialIcons
                                    name="flip-camera-ios"
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={selectPhoto}
                                style={{
                                    ...styles.previewIcon,
                                    height: 60,
                                    width: 60,
                                }}
                            >
                                <MaterialIcons
                                    name="save-alt"
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={sharePhoto}
                                style={styles.previewIcon}
                            >
                                <MaterialIcons
                                    name="share"
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={savePhoto}
                                style={styles.previewIcon}
                            >
                                <MaterialIcons
                                    name="save"
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </SafeAreaView>
        );
    }

    return (
        <Camera
            // width={dimensions.width}
            // height={(dimensions.width / 9) * 16}
            type={type}
            style={styles.camera}
            ref={cameraRef}
            ratio="16:9"
        >
            <TouchableOpacity
                onPress={noPhoto}
                style={{
                    ...styles.noPhoto,
                    left: 25,
                }}
            >
                <MaterialIcons name="no-photography" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePhoto} style={styles.circleIcon}>
                <FontAwesome name="circle" size={35} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={toggleCameraType}
                style={{
                    ...styles.noPhoto,
                    right: 25,
                }}
            >
                <MaterialIcons
                    name="flip-camera-android"
                    size={20}
                    color="white"
                />
            </TouchableOpacity>
        </Camera>
    );
}

const styles = StyleSheet.create({
    containerScreen: { flex: 1 },
    container: {
        flex: 1,
        justifyContent: "center",
    },
    camera: {
        flex: 1,
        // width: 300,
        // height: 200,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    noPhoto: {
        position: "absolute",
        bottom: 25,
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#fff",
        borderWidth: 1,
    },
    circleIcon: {
        height: 60,
        width: 60,
        marginBottom: 20,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#fff",
        borderWidth: 2,
    },
    preview: {
        flex: 1,
        alignSelf: "stretch",
    },
    previewIcons: {
        position: "absolute",
        backgroundColor: "transparent",
        bottom: 20,
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "100%",
    },
    previewIcon: {
        height: 50,
        width: 50,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#fff",
        borderWidth: 1,
    },
});
