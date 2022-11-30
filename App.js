import React, { useEffect, useCallback } from "react";
import { Provider } from "react-redux";
import { View, StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import Main from "./component/Main";
import { store } from "./redux/store";
import { AppDimensions } from "./hooks/Dimensions";

export default function App() {
    const [fontsLoaded] = useFonts({
        "Roboto-Bold": require("./assets/fonts/Roboto-Bold.ttf"),
        "Roboto-Medium": require("./assets/fonts/Roboto-Medium.ttf"),
        "Roboto-Regular": require("./assets/fonts/Roboto-Regular.ttf"),
        "Inter-Medium": require("./assets/fonts/Inter-Medium.ttf"),
    });

    useEffect(() => {
        async function prepare() {
            await SplashScreen.preventAutoHideAsync();
        }
        prepare();
    }, []);

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <View style={styles.container} onLayout={onLayoutRootView}>
            <AppDimensions>
                <Provider store={store}>
                    <Main />
                </Provider>
            </AppDimensions>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
