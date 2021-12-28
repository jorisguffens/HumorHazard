import Card from "../card/card";

import {useGameRound, usePlayer} from "../../../../redux/hooks";
import {useCallback} from "react";
import {usePacketHandler} from "../../../../socket/packetHandler";

import style from "./table.module.scss"

export default function Table() {

    const packetHandler = usePacketHandler();
    const round = useGameRound();
    const player = usePlayer();
    const judge = player.id === round.judge.id;

    const select = useCallback((card) => {
        if (!judge) return;
        packetHandler.sendc("GAME_PICK_CARDS", {cards: [card.id]});
    }, [packetHandler]);

    return (
        <div className={style.root}>
            <div className={style.startCards}>
                {round.start_cards.map((card, i) => {
                    return (
                        <div key={i} className={style.card}>
                            <Card card={card}/>
                        </div>
                    )
                })}
            </div>

            {round.picked_players && round.picked_players.map((item, i) => {
                return (
                    <div key={i} className={style.card}>
                        <Card disabled/>
                    </div>
                );
            })}

            {round.picked_cards && round.picked_cards.map((cards, i) => {
                return cards.map((card, j) => {
                    return (
                        <div key={i + "-" + j} className={style.card}>
                            <Card card={card} onClick={judge ? () => select(card) : null}/>
                        </div>
                    )
                });
            })}
        </div>
    )
}