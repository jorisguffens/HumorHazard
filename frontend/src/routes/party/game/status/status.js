import {Typography} from "@mui/material";
import {useGameParticipants, useGameRound, usePlayer, useRoundStatus} from "../../../../redux/hooks";
import {useEffect, useState} from "react";
import {usePacketHandler} from "../../../../socket/packetHandler";

export default function Status() {

    const status = useRoundStatus();
    const player = usePlayer();
    const participants = useGameParticipants();
    const round = useGameRound();

    const packetHandler = usePacketHandler();
    const [countdown, setCountdown] = useState("");

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("ROUND_COUNTDOWN_UPDATE", (value) => {
            setCountdown(value === 0 ? "" : value);
        });
        return () => unregister();
    }, [packetHandler]);

    const gp = participants[player.id];
    let text = "";
    if ( status === "FILLING" ) {
        if ( round.judge.id === player.id ) {
            text = "Pick a card"
        } else {
            text = "Waiting for the judge..."
        }
    } else if ( status === "PICKING" ) {
        if ( !gp || round.judge.id === player.id) {
            text = "Waiting for the players..."
        } else {
            text = "Pick a card"
        }
    } else if ( status === "CHOOSING_WINNER" ) {
        if ( round.judge.id === player.id) {
            text = "Choose a winner"
        } else {
            text = "Waiting for the judge..."
        }
    } else if ( status === "FINISHED" ) {
        text = "The winner is " + round.winner.name;
    }

    return (
        <div style={{display: "flex"}}>
            <Typography variant={"h4"} component={"h2"} style={{flexGrow: 1}}>
                {text}
            </Typography>
            <Typography variant={"h4"} component={"h2"}>
                {countdown}
            </Typography>
        </div>
    )
}