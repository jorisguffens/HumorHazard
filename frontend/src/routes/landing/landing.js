import {useCallback, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {Button, Container, Divider, Link, Paper, Typography} from "@mui/material";

import {useDispatchLogout, useDispatchParty, usePlayer} from "../../redux/hooks";

import Center from "../../common/center/center";
import Register from "../../common/register/register";

import style from "./landing.module.scss";
import {usePacketHandler} from "../../socket/packetHandler";

export default function Landing() {

    const player = usePlayer();
    const packetHandler = usePacketHandler();
    const dispatchParty = useDispatchParty();
    const dispatchLogout = useDispatchLogout();
    const navigate = useNavigate();

    const [parties, setParties] = useState([]);

    const create = useCallback(() => {
        packetHandler.sendc("PARTY_CREATE").then((party) => {
            dispatchParty(party);
            navigate("/" + party.id);
        });
    }, [packetHandler, navigate, dispatchParty]);

    useEffect(() => {
        packetHandler.send("PARTY_QUIT");
        dispatchParty(null);
    }, [packetHandler, dispatchParty]);

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("PARTYLIST", (list) => {
            setParties(list);
        });
        return () => unregister();
    }, [packetHandler]);

    if (!player) {
        return (
            <Register/>
        )
    }

    return (
        <Center>
            <Container maxWidth={"xs"}>
                <Paper className={style.wrapper}>
                    <Typography variant="h4" component="h1">
                        Humor Hazard
                    </Typography>
                    <Typography>
                        Your name is: <Typography color={"primary"} component={"span"}>{player.name}</Typography>
                    </Typography>
                    <br/>
                    <Divider/>

                    <Button className={style.button} onClick={() => dispatchLogout()}>
                        CHANGE NAME
                    </Button>
                    <Button variant={"contained"} className={style.button} onClick={create}>
                        CREATE PARTY
                    </Button>
                    <br/>

                    <Typography variant={"h6"} component={"h2"}>
                        How to play?
                    </Typography>
                    <Typography>
                        Check out the official rules at <Link
                        href="https://www.jokinghazardgame.com/">jokinghazardgame.com</Link>
                    </Typography>
                    <br/>

                    {parties.length > 0 && (
                        <>
                            <Divider/>
                            <br/>
                            <Typography variant={"h6"} component={"h2"}>
                                Public parties
                            </Typography>
                            <br/>

                            {parties.map((party, i) => (
                                <div key={i} className={style.publicParty}>
                                    <Typography className={style.publicPartyTitle}>
                                        <strong>{party.players[0].name}'s party</strong>
                                    </Typography>
                                    <div className={style.publicPartyPlayerCount}>
                                        {party.players.length} / {party.settings.player_limit}
                                    </div>
                                    <Button variant={"contained"} onClick={() => navigate("/" + party.id)}>
                                        <i className="fas fa-sign-in-alt"/>
                                    </Button>
                                </div>
                            ))}
                        </>
                    )}
                </Paper>
            </Container>
        </Center>
    )
}