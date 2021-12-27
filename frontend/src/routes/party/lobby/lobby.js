import {Container, Divider, Grid, Paper, Typography} from "@mui/material";

import Center from "../../../common/center/center";
import PartyLink from "../../../common/partylink/partylink";

import PlayerList from "./playerList/playerList";
import PartySettings from "./partySettings/partySettings";

import style from "./lobby.module.scss"

export default function Lobby() {

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
                        <Grid item md={6} xs={12}>
                            <Typography variant={"h5"} component={"h2"} className={style.subTitle}>
                                Players
                            </Typography>
                            <br/>
                            <PlayerList/>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Typography variant={"h5"} component={"h2"} className={style.subTitle}>
                                Settings
                            </Typography>
                            <br/>
                            <PartySettings/>
                        </Grid>
                    </Grid>

                </Paper>
            </Container>
        </Center>
    )
}
