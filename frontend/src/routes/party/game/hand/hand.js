import React, {useCallback, useEffect} from "react";

import {useDispatchGameHand, useGameHand, useShouldPickFromHand} from "../../../../redux/hooks";
import {usePacketHandler} from "../../../../socket/packetHandler";

import Card from "../card/card";

import style from "./hand.module.scss";

export default function Hand() {

    const hand = useGameHand();
    const packetHandler = usePacketHandler();

    const dispatchHand = useDispatchGameHand();
    const enabled = useShouldPickFromHand();

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("GAME_HAND_UPDATE", (hand) => {
            dispatchHand(hand);
        });
        return () => unregister();
    }, [packetHandler]);

    const select = useCallback((card) => {
        if ( !enabled ) return;
        packetHandler.sendc("GAME_PICK_CARDS", { cards: [card.id] });
    }, [enabled, packetHandler]);

    if (!hand) {
        return <p>Loading...</p>
    }

    return (
        <div className={style.hand}>
            {hand.map((card, i) => (
                <div key={i} className={style.card}>
                    <Card card={card} onClick={() => select(card)} disabled={!enabled}/>
                </div>
            ))}
        </div>
    )
}