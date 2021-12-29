import React, {useEffect, useState} from "react";

import {Alert, CircularProgress, Container, CssBaseline, Link, Typography} from "@mui/material";

import {usePacketHandler} from "../socket/packetHandler";
import {useDispatchLogin} from "../redux/hooks";

import Router from "./router";
import Center from "../common/center/center";
import Broadcast from "../common/broadcast/broadcast";

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
        return <Loader/>
    }

    return (
        <>
            <CssBaseline/>
            <Broadcast/>

            <Alert severity={"info"}>
                <strong>NEW UPDATE!</strong> The project has been severely updated. Please report bugs in my&nbsp;
                <Link href="https://discord.gg/dNWfCajm2F">discord</Link>.
            </Alert>

            <Container maxWidth={"xs"}>
            </Container>

            <Router/>
        </>
    )
}

function Loader() {

    const socketHandler = usePacketHandler();
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => {
            setShowMessage(true);
        }, 3000);
        return () => clearTimeout(id);
    }, [socketHandler]);

    return (
        <>
            {showMessage && (
                <Alert severity={"error"}>
                    Looks like you are having trouble connecting. Check my <Link href="https://discord.gg/dNWfCajm2F">discord</Link> for status updates.
                </Alert>
            )}
            <CssBaseline/>

            <Center>
                <Container maxWidth={"sm"} align={"center"}>
                    <Typography variant={"h4"} component={"h1"}>Connecting to server...</Typography>
                    <br/><br/>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <CircularProgress size={48}/>
                    </div>
                </Container>
            </Center>
        </>
    )
}