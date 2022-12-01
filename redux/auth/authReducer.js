import { createSlice } from "@reduxjs/toolkit";

const state = {
    userId: null,
    login: null,
    userPhoto: null,
    stateChange: null,
};

export const authSlice = createSlice({
    name: "auth",
    initialState: state,
    reducers: {
        updateUserProfile: (state, { payload }) => ({
            ...state,
            userId: payload.userId,
            login: payload.login,
            userPhoto: payload.userPhoto,
        }),
        authStateChange: (state, { payload }) => ({
            ...state,
            stateChange: payload.stateChange,
        }),
        authSignOut: () => state,
    },
});
