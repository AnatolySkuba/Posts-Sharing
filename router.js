import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";

const AuthStack = createStackNavigator();
const MainTab = createBottomTabNavigator();

import RegistrationScreen from "./screens/auth/RegistrationScreen";
import LoginScreen from "./screens/auth/LoginScreen";
import PostsScreen from "./screens/main/PostsScreen";
import CreatePostsScreen from "./screens/main/CreatePostsScreen";
import ProfileScreen from "./screens/main/ProfileScreen";
// import CommentsScreen from "./screens/CommentsScreen";

export const useRoute = (isAuth) => {
    if (!isAuth) {
        return (
            <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                <AuthStack.Screen name="Login" component={LoginScreen} />
                <AuthStack.Screen
                    name="Registration"
                    component={RegistrationScreen}
                />
            </AuthStack.Navigator>
        );
    }

    return (
        <MainTab.Navigator
            backBehavior="history"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarInactiveTintColor: "rgba(33, 33, 33, 0.8)",
                tabBarActiveTintColor: "#FFFFFF",
                tabBarActiveBackgroundColor: "#FF6C00",
                tabBarItemStyle: {
                    height: 40,
                    borderRadius: 20,
                    marginHorizontal: 6,
                },
                tabBarStyle: {
                    paddingHorizontal: "15%",
                    paddingVertical: 9,
                },
            }}
        >
            <MainTab.Group screenOptions={{ tabBarStyle: { height: 58 } }}>
                <MainTab.Screen
                    name="Posts"
                    component={PostsScreen}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <Feather name="grid" size={size} color={color} />
                        ),
                    }}
                />
            </MainTab.Group>
            <MainTab.Group screenOptions={{ tabBarStyle: { height: 0 } }}>
                <MainTab.Screen
                    name="Create"
                    component={CreatePostsScreen}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <Feather name="plus" size={size} color={color} />
                        ),
                    }}
                />
            </MainTab.Group>
            <MainTab.Group screenOptions={{ tabBarStyle: { height: 58 } }}>
                <MainTab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ size, color }) => (
                            <Feather name="user" size={size} color={color} />
                        ),
                    }}
                />
            </MainTab.Group>
        </MainTab.Navigator>
    );
};
