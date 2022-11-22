import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TouchableWithoutFeedback,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    StyleSheet,
} from "react-native";
import { Camera, CameraType } from "expo-camera";
import { Feather } from "@expo/vector-icons";

import { useDimensions } from "../../hooks/Dimensions";
import PhotoCamera from "../../component/PhotoCamera";
import Svg, { Path } from "react-native-svg";

const initialState = {
    name: "",
    locality: "",
    photo: "",
};

export default function CreatePostsScreen({ navigation }) {
    const [isShowKeyboard, setIsShowKeyboard] = useState(false);
    const [state, setState] = useState(initialState);
    const [isCamera, setIsCamera] = useState(false);
    const { dimensions } = useDimensions();
    const [isFocused, setIsFocused] = useState({
        name: false,
        locality: false,
        photo: false,
    });

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

    const handleInputFocus = (textinput) => {
        setIsFocused({
            [textinput]: true,
        });
        setIsShowKeyboard(true);
    };

    const handleInputBlur = (textinput) => {
        setIsFocused({
            [textinput]: false,
        });
    };

    const keyboardHide = () => {
        setIsShowKeyboard(false);
        Keyboard.dismiss();
    };

    // const [type, setType] = useState(CameraType.back);

    // function toggleCameraType() {
    //     setType((current) =>
    //         current === CameraType.back ? CameraType.front : CameraType.back
    //     );
    // }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.containerScreen}
        >
            <TouchableWithoutFeedback onPress={keyboardHide}>
                <View style={styles.containerScreen}>
                    {isCamera ? (
                        <PhotoCamera
                            setState={setState}
                            setIsCamera={setIsCamera}
                        />
                    ) : (
                        <>
                            <View style={styles.header}>
                                <Text style={styles.title}>Create post</Text>
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
                                <View style={styles.photo}>
                                    {state.photo && (
                                        <View style={styles.photoContainer}>
                                            <Image
                                                // source={{ uri: photo.uri }}
                                                source={{
                                                    uri: state.photo,
                                                }}
                                                style={{
                                                    width: 200,
                                                    height: 200,
                                                }}
                                            />
                                        </View>
                                    )}
                                    <TouchableOpacity
                                        onPress={() => setIsCamera(true)}
                                        style={styles.photoIcon}
                                    >
                                        <Svg
                                            width={24}
                                            height={24}
                                            viewBox="0 0 24 24"
                                        >
                                            <Path
                                                d="M11.9998 15.2C13.7671 15.2 15.1998 13.7673 15.1998 12C15.1998 10.2327 13.7671 8.79999 11.9998 8.79999C10.2325 8.79999 8.7998 10.2327 8.7998 12C8.7998 13.7673 10.2325 15.2 11.9998 15.2Z"
                                                fill="#BDBDBD"
                                            />
                                            <Path
                                                d="M9 2L7.17 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17Z"
                                                fill="#BDBDBD"
                                            />
                                        </Svg>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity
                                    onPress={() => console.log(dimensions)}
                                    style={styles.uploadPhoto}
                                >
                                    <Text style={styles.uploadPhotoText}>
                                        Upload photo
                                    </Text>
                                </TouchableOpacity>
                                <TextInput
                                    value={state.name}
                                    onChangeText={(value) =>
                                        setState((prevState) => ({
                                            ...prevState,
                                            name: value,
                                        }))
                                    }
                                    placeholder="Name..."
                                    placeholderTextColor={"#BDBDBD"}
                                    onFocus={() => handleInputFocus("name")}
                                    onBlur={() => handleInputBlur("name")}
                                    style={{
                                        ...styles.input,
                                        borderBottomColor: isFocused.name
                                            ? "#FF6C00"
                                            : "#E8E8E8",
                                    }}
                                />
                                <TextInput
                                    value={state.locality}
                                    onChangeText={(value) =>
                                        setState((prevState) => ({
                                            ...prevState,
                                            locality: value,
                                        }))
                                    }
                                    placeholder="Locality..."
                                    placeholderTextColor={"#BDBDBD"}
                                    onFocus={() => handleInputFocus("locality")}
                                    onBlur={() => handleInputBlur("locality")}
                                    style={{
                                        ...styles.input,
                                        paddingLeft: 25,
                                        borderBottomColor: isFocused.locality
                                            ? "#FF6C00"
                                            : "#E8E8E8",
                                    }}
                                />
                                <TouchableOpacity
                                    onPress={() =>
                                        console.log("locality", state.photo)
                                    }
                                >
                                    <Feather
                                        name="map-pin"
                                        size={20}
                                        color="rgba(189, 189, 189, 1)"
                                        style={styles.locality}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={styles.btn}
                                    onPress={() => console.log(isCamera)}
                                >
                                    <Text style={styles.btnTitle}>Publish</Text>
                                </TouchableOpacity>
                                {!isShowKeyboard && (
                                    <TouchableOpacity
                                        onPress={() => console.log(dimensions)}
                                        style={{
                                            ...styles.trash,
                                            left: dimensions.width / 2 - 35,
                                        }}
                                    >
                                        <Feather
                                            name="trash-2"
                                            size={20}
                                            color="rgba(218, 218, 218, 1)"
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    containerScreen: { flex: 1 },
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
    arrowLeftContainer: { position: "absolute", bottom: 11, left: 20 },
    container: { flex: 1, paddingHorizontal: 17, backgroundColor: "#FFFFFF" },
    photo: {
        height: 240,
        marginTop: 32,
        borderRadius: 8,
        backgroundColor: "#F6F6F6",
        justifyContent: "center",
        alignItems: "center",
    },
    photoContainer: {
        position: "absolute",
    },
    camera: {
        // flex: 1,
        // width: 300,
        // height: 200,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    photoIcon: {
        position: "absolute",
        height: 60,
        width: 60,
        borderRadius: 30,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        justifyContent: "center",
        alignItems: "center",
    },
    circleIcon: {
        height: 60,
        width: 60,
        marginBottom: 20,
        borderRadius: 30,
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#fff",
        borderWidth: 2,
    },
    preview: {
        alignSelf: "stretch",
        flex: 1,
    },
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
    input: {
        marginBottom: 16,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#E8E8E8",
        fontFamily: "Roboto-Medium",
        fontWeight: "500",
        fontSize: 16,
        lineHeight: 19,
        color: "#212121",
    },
    locality: { position: "absolute", top: -55 },
    btn: {
        marginTop: 25,
        paddingVertical: 16,
        alignItems: "center",
        backgroundColor: "#FF6C00",
        borderRadius: 100,
    },
    btnTitle: {
        fontFamily: "Roboto-Regular",
        fontWeight: "400",
        fontSize: 16,
        lineHeight: 19,
        color: "#FFF",
    },
    trash: {
        width: 70,
        height: 40,
        position: "absolute",
        bottom: 34,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F6F6F6",
        borderRadius: 20,
    },
});
