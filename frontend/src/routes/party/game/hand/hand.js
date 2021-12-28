import React, {useCallback, useEffect, useMemo} from "react";

import {useDispatchGameHand, useGameHand, useGameRound, usePlayer, useRoundStatus} from "../../../../redux/hooks";
import {usePacketHandler} from "../../../../socket/packetHandler";

import Card from "../card/card";

import style from "./hand.module.scss";

export default function Hand() {

    const hand = useGameHand();
    const packetHandler = usePacketHandler();
    const player = usePlayer();
    const round = useGameRound();
    const state = useRoundStatus();

    const dispatchHand = useDispatchGameHand();

    const judgePick = useMemo(() => {
        return state === "FILLING" && player.id === round.judge.id;
    }, [state, round, player]);

    const playerPick = useMemo(() => {
        return state === "PICKING" && player.id !== round.judge.id
            && round.picked_players.indexOf(player.id) === -1;
    }, [state, round, player])

    const enabled = judgePick || playerPick;

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("GAME_HAND_UPDATE", (hand) => {
            dispatchHand(hand);
        });
        return () => unregister();
    }, [packetHandler, dispatchHand]);

    const select = useCallback((card) => {
        if (!enabled) return;
        packetHandler.sendc("GAME_PICK_CARDS", {cards: [card.id]});
    }, [enabled, packetHandler]);

    if (!hand) {
        return <p>Loading...</p>
    }

    return (
        <div className={style.hand}>
            {hand.map((card, i) => (
                <div key={i} className={style.card}>
                    <Card card={card} onClick={() => select(card)}
                          disabled={(!judgePick && !playerPick) || (judgePick && card.type === "RED")}/>
                </div>
            ))}
        </div>
    )
}