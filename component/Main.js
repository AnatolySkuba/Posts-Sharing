import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";

import { authStateChangeUser } from "../redux/auth/authOperations";
import { useRoute } from "../router";

export default function Main() {
    const { stateChange } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        authStateChangeUser(dispatch);
    }, []);

    const routing = useRoute(stateChange);

    return <NavigationContainer>{routing}</NavigationContainer>;
}
