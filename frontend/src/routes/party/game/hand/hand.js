import React, {useCallback, useEffect, useMemo, useState} from "react";

import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

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

    const [judgePick, setJudgePick] = useState(null);

    const isJudgePick = useMemo(() => {
        return state === "FILLING" && player.id === round.judge.id;
    }, [state, round, player]);

    const isPlayerPick = useMemo(() => {
        return state === "PICKING" && player.id !== round.judge.id
            && round.picked_players.indexOf(player.id) === -1;
    }, [state, round, player])

    const enabled = isJudgePick || isPlayerPick;

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("GAME_HAND_UPDATE", (hand) => {
            dispatchHand(hand);
        });
        return () => unregister();
    }, [packetHandler, dispatchHand]);

    const select = useCallback((card, before) => {
        if (!enabled) return;
        packetHandler.sendc("GAME_PICK_CARDS", {cards: [card.id], before});
        setJudgePick(null);
    }, [enabled, packetHandler]);

    if (!hand) {
        return <p>Loading...</p>
    }

    return (
        <>
            <div className={style.hand}>
                {hand.map((card, i) => (
                    <div key={i} className={style.card}>
                        <Card card={card} onClick={isJudgePick ? () => setJudgePick(card) : () => select(card)}
                              disabled={(!isJudgePick && !isPlayerPick) || (isJudgePick && card.type === "RED")}/>
                    </div>
                ))}
            </div>

            {judgePick && (
                <Dialog open={true} onClose={() => setJudgePick(null)}>
                    <DialogTitle>
                        Select card position
                    </DialogTitle>
                    <DialogContent>
                        <div className={style.judgePickDialog}>
                            <div>
                                <Card card={judgePick} onClick={() => select(judgePick, true)} selectText={"Before"}/>
                            </div>
                            <div>
                                <Card card={round.start_cards[0]}/>
                            </div>
                            <div>
                                <Card card={judgePick} onClick={() => select(judgePick, false)} selectText={"After"}/>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setJudgePick(null)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}