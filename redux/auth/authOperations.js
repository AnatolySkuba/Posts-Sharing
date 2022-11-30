import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged,
    signOut,
} from "firebase/auth";
import auth from "../../firebase/config";
import { getAuth } from "firebase/auth/react-native";
import { Alert } from "react-native";

import { authSlice } from "./authReducer";

export async function authSignUpUser(dispatch, { login, email, password }) {
    const user = getAuth(auth);

    try {
        await createUserWithEmailAndPassword(user, email, password);
        await updateProfile(user.currentUser, { displayName: login });
    } catch (error) {
        Alert.alert("Sign up error", error.message);
    }

    const { displayName, uid } = user.currentUser;

    dispatch(
        authSlice.actions.updateUserProfile({
            userId: uid,
            login: displayName,
        })
    );
}

export async function authSignInUser({ email, password }) {
    try {
        await signInWithEmailAndPassword(getAuth(auth), email, password);
    } catch (error) {
        Alert.alert("Sign in error", error.message);
    }
}

export async function authSignOutUser(dispatch) {
    try {
        await signOut(getAuth(auth));
        dispatch(authSlice.actions.authSignOut());
    } catch (error) {
        Alert.alert("Sign out error", error.message);
    }
}

export async function authStateChangeUser(dispatch) {
    onAuthStateChanged(getAuth(auth), (user) => {
        if (user) {
            dispatch(
                authSlice.actions.authStateChange({
                    stateChange: true,
                })
            );
            dispatch(
                authSlice.actions.updateUserProfile({
                    userId: user.uid,
                    login: user.displayName,
                })
            );
        }
    });
}
