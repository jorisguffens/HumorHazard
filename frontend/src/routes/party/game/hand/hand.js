import React, {useCallback, useEffect} from "react";

import {useDispatchGameHand, useGameHand} from "../../../../redux/hooks";
import {usePacketHandler} from "../../../../socket/packetHandler";

import Card from "../card/card";

import style from "./hand.module.scss";

export default function Hand() {

    const hand = useGameHand();
    const packetHandler = usePacketHandler();

    const dispatchHand = useDispatchGameHand();

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("GAME_HAND_UPDATE", (hand) => {
            dispatchHand(hand);
        });
        return () => unregister();
    }, [packetHandler]);

    const select = useCallback((card) => {

    }, [packetHandler]);

    if (!hand) {
        return <p>Loading...</p>
    }

    console.log(hand);

    return (
        <div className={style.hand}>
            {hand.map((card, i) => (
                <div key={i} className={style.card}>
                    <Card card={card} onClick={() => select(card)}/>
                </div>
            ))}
        </div>
    )
}