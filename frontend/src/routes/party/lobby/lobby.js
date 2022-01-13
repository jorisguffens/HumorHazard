import React, {useCallback} from "react";

import {Button, Container, Divider, Grid, Paper, Typography, useMediaQuery, useTheme} from "@mui/material";

import {usePartyPlayers, usePlayer} from "../../../redux/hooks";
import {usePacketHandler} from "../../../socket/packetHandler";

import Center from "../../../common/center/center";
import PartyLink from "../../../common/partylink/partylink";

import PlayerList from "./playerList/playerList";
import PartySettings from "./partySettings/partySettings";
import Chatbox from "../../../common/chatbox/chatbox";

import style from "./lobby.module.scss"
import clsx from "clsx";

export default function Lobby() {

    const player = usePlayer();
    const partyPlayers = usePartyPlayers();
    const packetHandler = usePacketHandler();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const start = useCallback((e) => {
        e.preventDefault();
        packetHandler.send("PARTY_START_GAME");
    }, [packetHandler]);

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
                            <Typography variant={"h3"} component={"h1"} className={clsx(isMobile, style.textCenter)}>
                                Humor Hazard
                            </Typography>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <PartyLink/>
                        </Grid>
                    </Grid>
                    <br/>
                    <Divider/>
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

                        {isMobile && <Grid item xs={12}><br/><Divider/></Grid>}

                        <Grid item md={6} xs={12} className={style.settingsWrapper}>
                            <Typography variant={"h5"} component={"h2"} className={style.subTitle}>
                                Settings
                            </Typography>
                            <br/>
                            <PartySettings/>
                        </Grid>
                    </Grid>
                    <br/>
                    <Divider/>
                    <br/>
                    <Typography variant={"h5"} component={"h2"} className={style.subTitle}>
                        Chatbox
                    </Typography>
                    <br/>
                    <Grid container>
                        <Chatbox/>
                    </Grid>

                </Paper>
            </Container>
        </Center>
    )
}
