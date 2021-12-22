import React from "react";
import {connect} from "react-redux";
import clsx from "clsx";

import {createPacket, useSocketHandler} from "../../socket/handler";

import style from "./picks.scss";
import Card from "../card/card";
import {Button} from "@mui/material";

function Picks({ player, game, round }) {

    const socketHandler = useSocketHandler();

    if ( round.status === "picking" ) {
        const cards = [];
        for ( let pid of Object.keys(round.picked) ) {
            for ( let i = 0; i < round.picked[pid]; i++ ) {
                cards.push(<div className={style.card} key={pid + i}><Card flipped={true}/></div>);
            }
        }

        return (

            <div className={clsx(style.picks, round.card.type === "red" && style.bonusRoundPicks)}>
                {cards}
            </div>
        )
    }

    if ( round.status === "selecting_winner" || round.status === "finished") {
        if ( round.picks == null ) {
            return null;
        }

        function choose(card) {
            if ( round.judge !== player.id ) {
                return;
            }

            socketHandler.send(createPacket("PickCard", {"card": card.id}));
        }

        if ( round.card.type === "red" ) {
            return (
                <div className={clsx(style.picks, style.bonusRoundPicks)}>
                    {round.picks.map((pick, i) => {
                        return (
                            <div key={i} className={clsx(
                                style.group,
                                round.winnerPick != null && round.winnerPick[0].id === pick[0].id && style.picked,
                                round.winnerPick != null && round.winnerPick[0].id !== pick[0].id && style.notpicked,
                                round.status === "selecting_winner" && round.judge === player.id && style.pickable
                            )}>
                                {pick.map((card, j) => {
                                    return (
                                            <div key={j} className={style.card}>

                                            <Card resource={card.resource}/>
                                        </div>
                                    )
                                })}

                                <div className={style.overlay}>
                                    <div className={style.verticalCenterWrapper}>
                                        <div className={style.verticalCenter}>
                                            <Button onClick={() => choose(pick[0])}>
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
        } else {
            return (
                <div className={style.picks}>
                    {round.picks.map((card, i) => {
                        return (
                            <div key={i} className={clsx(
                                style.card,
                                round.winnerPick === card.id && style.picked,
                                round.winnerPick != null && round.winnerPick !== card.id && style.notpicked,
                                round.status === "selecting_winner" && round.judge === player.id && style.pickable)
                            }>

                                <Card resource={card.resource}/>

                                <div className={style.overlay}>
                                    <div className={style.verticalCenterWrapper}>
                                        <div className={style.verticalCenter}>
                                            <Button onClick={() => choose(card)}>
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
    }

    return null;
}

function mapStateToProps(state) {
    const { player, game, round } = state;
    return {
        player: player,
        game: game,
        round: round
    };
}

export default connect(mapStateToProps)(Picks);