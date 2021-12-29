import React, {useEffect, useState} from "react";

import {Alert, Container, CssBaseline, Link} from "@mui/material";

import {usePacketHandler} from "../socket/packetHandler";
import {useDispatchLogin} from "../redux/hooks";

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
    }, [socketHandler, dispatchLogin]);

    if (!socketHandler || loggingIn) {
        return <p>Loading...</p>
    }

    return (
        <>
            <CssBaseline/>
            <Container maxWidth={"xs"}>
                <br/>
                <Alert severity={"info"}>
                    <strong>NEW UPDATE!</strong> The project has been severely updated. Please report bugs in my&nbsp;
                    <Link href="https://discord.gg/dNWfCajm2F">discord</Link>.
                </Alert>
            </Container>

            <Router/>
        </>
    )
}