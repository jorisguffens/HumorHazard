import Card from "../card/card";

import {useGameRound, usePlayer} from "../../../../redux/hooks";
import {useCallback} from "react";
import {usePacketHandler} from "../../../../socket/packetHandler";

import style from "./table.module.scss"
import {Paper} from "@mui/material";

export default function Table() {

    const packetHandler = usePacketHandler();
    const round = useGameRound();
    const player = usePlayer();
    const judge = player.id === round.judge.id;

    const select = useCallback((card) => {
        if (!judge) return;
        packetHandler.sendc("GAME_PICK_CARDS", {cards: [card.id]});
    }, [judge, packetHandler]);

    return (
        <div className={style.table}>
            <Paper className={style.startCards}>
                <div>
                    {round.start_cards.map((card, i) => {
                        return (
                            <div key={i} className={style.card}>
                                <Card card={card}/>
                            </div>
                        )
                    })}
                </div>
            </Paper>

            {round.picked_players && round.picked_players.map((item, i) => {
                return (
                    <div key={i} className={style.card}>
                        <Card disabled/>
                    </div>
                );
            })}

            {round.picked_cards && round.picked_cards.map((cards, i) => {
                return cards.map((card, j) => {
                    const disabled = round.winner && round.winner_cards.filter(c => c.id === card.id).length === 0
                    return (
                        <div key={i + "-" + j} className={style.card}>
                            <Card card={card} onClick={judge && !round.winner ? () => select(card) : null}
                                  disabled={disabled}/>
                        </div>
                    )
                });
            })}
        </div>
    )
}