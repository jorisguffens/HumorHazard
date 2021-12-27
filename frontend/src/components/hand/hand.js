import React from "react";
import clsx from "clsx";
import {connect} from "react-redux";

import {createPacket, usePacketHandler} from "../../socket/packetHandler";

import Card from "../card/card";

import style from "./hand.scss";
import {Button} from "@mui/material";

function Hand({ player, game, round, hand, complete }) {

    const socketHandler = usePacketHandler();

    const [roundNumber, setRoundNumber] = React.useState(-1);
    const [picked, setPicked] = React.useState(null);

    React.useEffect(function() {
        if ( game.roundNumber === roundNumber ) {
            return;
        }

        setRoundNumber(game.roundNumber);
        setPicked(null);
    }, [game]);

    const disabled = round.playerStatuses[player.id] !== "picking" || round.status === "selecting_winner";

    function onClick(card) {
        if ( disabled ) {
            return;
        }

        if ( round.card.type === "red" ) {
            socketHandler.send(createPacket("PickCard", {"card": card.id}));

            if ( picked == null ) {
                setPicked([card.id]);
            } else {
                setPicked([picked[0], card.id]);
                complete(card.id);
            }
            return;
        }

        // black card
        socketHandler.send(createPacket("PickCard", {"card": card.id}));
        setPicked(card.id);
        complete(card.id);
    }

    if ( hand == null ) {
        return null;
    }

    return (
        <div className={style.hand}>
            { hand.map((card, i) => {
                let dis = disabled || (round.status === "filling" && card.type === "red") || (round.card.type === "red" && card.type === "red");
                return (
                    <div key={i} className={clsx(
                        style.card,
                        dis && style.disabled,
                        round.status === "picking" && round.card.type === "black" && picked != null && picked === card.id && style.picked,
                        round.status === "picking" && round.card.type === "red" && picked != null && (picked[0] === card.id || picked[1] === card.id) && style.picked
                    )}>

                        <Card resource={card.resource} disabled={dis}/>

                        <div className={style.overlay}>
                            <div className={style.verticalCenterWrapper}>
                                <div className={style.verticalCenter}>
                                    <Button variant="contained" onClick={() => onClick(card)}>
                                        Select
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function mapStateToProps(state) {
    const { player, game, round, hand } = state;
    return {
        player: player,
        game: game,
        round: round,
        hand: hand
    };
}

export default connect(mapStateToProps)(Hand);