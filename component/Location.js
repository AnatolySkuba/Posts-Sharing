import React from "react";
import { TouchableOpacity, Alert, Linking, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { Feather } from "@expo/vector-icons";

export default function Locality({ setState }) {
    async function getLocation() {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
            Alert.alert("", "Permission to access location was denied", [
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

        const location = await Location.getCurrentPositionAsync();
        const address = await Location.reverseGeocodeAsync(location.coords);

        if (!address[0].region) {
            address[0].region = address[0].city;
        }

        setState((prevState) => ({
            ...prevState,
            locality: `${address[0].region}, ${address[0].country}`,
        }));
    }

    return (
        <TouchableOpacity onPress={getLocation}>
            <Feather
                name="map-pin"
                size={20}
                color="rgba(189, 189, 189, 1)"
                style={styles.locality}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    locality: { position: "absolute", top: -55 },
});
