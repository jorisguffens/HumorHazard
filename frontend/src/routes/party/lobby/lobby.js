import {Container, Divider, Grid, Paper, Typography} from "@mui/material";

import {useParty, usePlayer} from "../../../redux/hooks";

import Center from "../../../common/center/center";
import PartyLink from "../../../common/partylink/partylink";

import PlayerList from "./playerList/playerList";

import style from "./lobby.module.scss"

export default function Lobby() {

    const player = usePlayer();
    const party = useParty();

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
                            <PlayerList/>
                        </Grid>
                        <Grid item md={6} xs={12}>

                        </Grid>
                    </Grid>

                </Paper>
            </Container>
        </Center>
    )
}
