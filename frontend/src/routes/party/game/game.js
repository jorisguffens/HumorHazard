import {Container, Divider, Grid, Paper, Typography} from "@mui/material";
import PartyLink from "../../../common/partylink/partylink";

import Hand from "./hand/hand";
import Table from "./table/table";
import PlayerList from "./playerList/playerList";

import style from "./game.module.scss";
import {useEffect} from "react";
import {usePacketHandler} from "../../../socket/packetHandler";
import {useDispatchGame, useDispatchGameRound} from "../../../redux/hooks";
import Status from "./status/status";

export default function Game() {

    const packetHandler = usePacketHandler();
    const dispatchGame = useDispatchGame();
    const dispatchGameRound = useDispatchGameRound();

    useEffect(() => {
        const unregister = packetHandler.registerListener((packet) => {
            if (packet.type === "GAME_UPDATE") {
                dispatchGame(packet.payload);
            } else if (packet.type === "GAME_ROUND_UPDATE") {
                dispatchGameRound(packet.payload);
            }
        });
        return () => unregister();
    }, [packetHandler, dispatchGame, dispatchGameRound]);

    return (
        <Container maxWidth={"xl"}>
            <br/>
            <Paper className={style.paper}>
                <Grid container>
                    <Grid item xs={6} className={style.title}>
                        <Typography variant={"h4"} component={"h1"}>
                            Humor Hazard
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <PartyLink/>
                    </Grid>
                </Grid>
            </Paper>

            <Table/>
            <Divider/>
            <Hand/>

            <Paper className={style.paper}>
                <Status/>
            </Paper>
            <br/>
            <Divider/>
            <br/>

            <Grid container>
                <Grid item sm={6} md={4} xs={12}>
                    <Paper className={style.paper}>
                        <PlayerList/>
                    </Paper>
                </Grid>
                <Grid item sm={6} md={8} xs={12}>

                </Grid>
            </Grid>
            <br/>
        </Container>
    )
}