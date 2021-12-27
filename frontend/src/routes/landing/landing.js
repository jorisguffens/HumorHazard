import {useCallback} from "react";
import {useNavigate} from "react-router-dom";

import {Button, Container, Divider, Paper, Typography} from "@mui/material";

import {useDispatchParty, usePlayer} from "../../redux/hooks";

import Center from "../../common/center/center";
import Register from "../../common/register/register";

import style from "./landing.module.scss";
import {usePacketHandler} from "../../socket/packetHandler";

export default function Landing() {

    const player = usePlayer();
    const packetHandler = usePacketHandler();
    const dispatchParty = useDispatchParty();
    const navigate = useNavigate();

    const create = useCallback(() => {
        packetHandler.sendc("CREATE_PARTY").then((party) => {
            dispatchParty(party);
            navigate("/" + party.id);
        }).catch(err => {
            console.log(err);
        })
    }, [packetHandler])

    if (!player) {
        return (
            <Register/>
        )
    }

    return (
        <Center>
            <Container maxWidth={"xs"}>
                <Typography variant={"h2"} component={"h1"} className={style.title}>
                    Humor Hazard
                </Typography>
                <Divider/>
                <br/>
                <Button variant={"contained"} className={style.createButton} onClick={create}>
                    CREATE PARTY
                </Button>
                <br/>
                <Paper className={style.publicPartiesWrapper}>
                    Public parties are currently disabled.
                </Paper>
            </Container>
        </Center>
    )
}