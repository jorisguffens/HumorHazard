import React, {useCallback} from "react";

import {Button, Container, Divider, Grid, Paper, Typography} from "@mui/material";

import {usePartyPlayers, usePlayer} from "../../../redux/hooks";
import {usePacketHandler} from "../../../socket/packetHandler";

import Center from "../../../common/center/center";
import PartyLink from "../../../common/partylink/partylink";

import PlayerList from "./playerList/playerList";
import PartySettings from "./partySettings/partySettings";

import style from "./lobby.module.scss"

export default function Lobby() {

    const player = usePlayer();
    const partyPlayers = usePartyPlayers();
    const packetHandler = usePacketHandler();

    const start = useCallback((e) => {
        e.preventDefault();
        packetHandler.send("PARTY_START_GAME");
    }, []);

    let footer = null;
    if ( partyPlayers.length < 3) {
        let amount = 3 - partyPlayers.length;
        footer = <div>You need {amount} more {amount === 1 ? "player" : "players"} to start the game.</div>
    } else if (partyPlayers[0].id !== player.id) {
        footer = <div>The party owner must start the game.</div>
    }

    return (
        <Center>
            <Container maxWidth={"md"}>
                <Paper className={style.wrapper}>

                    <Grid container>
                        <Grid item md={6} xs={12}>
                            <Typography variant={"h3"} component={"h1"}>
                                Humor Hazard
                            </Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <PartyLink/>
                        </Grid>
                    </Grid>
                    <br/>
                    <Divider/>
                    <br/>
                    <Grid container>
                        <Grid item md={6} xs={12} className={style.playersWrapper}>
                            <Typography variant={"h5"} component={"h2"} className={style.subTitle}>
                                Players
                            </Typography>
                            <br/>
                            <div className={style.playersList}>
                                <PlayerList/>
                            </div>
                            <div className={style.playersActions}>
                                {footer}
                                <br/>
                                <Button variant="contained" disabled={!!footer} onClick={start}>
                                    START GAME
                                </Button>
                            </div>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Typography variant={"h5"} component={"h2"} className={style.subTitle}>
                                Settings
                            </Typography>
                            <br/>
                            <PartySettings/>
                        </Grid>
                    </Grid>
                    <br/>
                    <Grid container>

                    </Grid>

                </Paper>
            </Container>
        </Center>
    )
}
