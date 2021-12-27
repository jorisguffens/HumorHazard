import {Container, Grid, Paper, Typography} from "@mui/material";

import Center from "../../../common/center/center";
import PartyLink from "../../../common/partylink/partylink";

import style from "./game.module.scss";
import Hand from "./hand/hand";

export default function Game() {

    return (
        <Center>
            <Container maxWidth={"md"}>
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
                <br/>
                <Hand/>
            </Container>
        </Center>
    )
}