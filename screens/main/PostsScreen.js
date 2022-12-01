import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import DefaultScreenPosts from "../nested/DefaultScreenPosts";
import CommentsScreen from "../nested/CommentsScreen";
import MapScreen from "../nested/MapScreen";

const NestedScreen = createStackNavigator();

export default function PostsScreen({ navigation }) {
    return (
        <NestedScreen.Navigator
            screenListeners={{
                state: (e) => {
                    e.data.state.routes.length === 2
                        ? navigation.setOptions({
                              tabBarStyle: {
                                  height: 0,
                              },
                          })
                        : navigation.setOptions({
                              tabBarStyle: {
                                  paddingHorizontal: "15%",
                                  paddingVertical: 9,
                                  height: 58,
                              },
                          });
                },
            }}
            screenOptions={{ headerShown: false }}
        >
            <NestedScreen.Screen
                name="DefaultScreen"
                component={DefaultScreenPosts}
            />
            <NestedScreen.Screen name="Comments" component={CommentsScreen} />
            <NestedScreen.Screen name="Map" component={MapScreen} />
        </NestedScreen.Navigator>
    );
}
