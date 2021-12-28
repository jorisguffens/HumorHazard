import React, {useEffect, useState} from "react";

import {CssBaseline} from "@mui/material";

import {usePacketHandler} from "../socket/packetHandler";
import {useDispatchLogin} from "../redux/hooks";

import Broadcast from "../components/broadcast/broadcast";
import Notifications from "../components/notifications/notifications";

import Router from "./router";

export default function Handler() {

    const dispatchLogin = useDispatchLogin();
    const socketHandler = usePacketHandler();
    const [loggingIn, setLoggingIn] = useState(true);

    useEffect(() => {
        if (!socketHandler) return;

        const token = sessionStorage.getItem("login_token");
        if (!token) {
            setLoggingIn(false);
            return;
        }

        setLoggingIn(true);
        socketHandler.sendc("LOGIN", {token}).then((player) => {
            dispatchLogin(player);
        }).finally(() => {
            setLoggingIn(false);
        })
    }, [socketHandler]);

    if (!socketHandler || loggingIn) {
        return <p>Loading...</p>
    }

    return (
        <>
            <CssBaseline/>
            <Broadcast/>
            <Notifications/>

            <Router/>
        </>
    )
}