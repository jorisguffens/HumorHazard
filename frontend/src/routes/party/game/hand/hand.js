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

    const [selected, setSelected] = useState(null);

    const isJudgePick = useMemo(() => {
        return state === "FILLING" && player.id === round.judge.id;
    }, [state, round, player]);

    const isPlayerPick = useMemo(() => {
        return state === "PICKING" && player.id !== round.judge.id
            && round.picked_players.indexOf(player.id) === -1;
    }, [state, round, player])

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("GAME_HAND_UPDATE", (hand) => {
            dispatchHand(hand);
        });
        return () => unregister();
    }, [packetHandler, dispatchHand]);

    const select = useCallback((cards, before) => {
        if (!isJudgePick && !isPlayerPick) {
            return;
        }

        packetHandler.sendc("GAME_PICK_CARDS", {cards, before});
        setSelected(null);
    }, [packetHandler, isJudgePick, isPlayerPick]);

    const pick = useCallback((card) => {
        if (isJudgePick) {
            setSelected(card);
            return;
        }

        if (round.bonus_round) {
            if (selected && selected !== card) {
                select([selected.id, card.id]);
            } else {
                setSelected(card);
            }
            return;
        }

        if (isPlayerPick) {
            select([card.id]);
        }
    }, [select, isJudgePick, selected]);

    const disabled = useCallback((card) => {
        return (!isJudgePick && !isPlayerPick) || (card.type === "RED" && (isJudgePick || round.bonus_round))
    }, [isJudgePick, isPlayerPick, round]);

    if (!hand) {
        return null;
    }

    return (
        <>
            <div className={style.hand}>
                {hand.map((card, i) => (
                    <div key={i} className={style.card}>
                        <Card card={card} onClick={() => pick(card)} disabled={disabled(card)}/>
                        {selected === card && (
                            <div className={style.selected} onClick={() => setSelected(null)}>
                                <i className="fas fa-check"/><
                            /div>
                        )}
                    </div>
                ))}
            </div>

            {isJudgePick && selected && (
                <Dialog open={true} scroll="body" onClose={() => setSelected(null)}>
                    <DialogTitle>
                        Select card position
                    </DialogTitle>
                    <DialogContent>
                        <div className={style.judgePickDialog}>
                            <div>
                                <Card card={selected} onClick={() => select([selected.id], true)}
                                      selectText={"Before"}/>
                            </div>
                            <div>
                                <Card card={round.start_cards[0]}/>
                            </div>
                            <div>
                                <Card card={selected} onClick={() => select([selected.id], false)}
                                      selectText={"After"}/>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setSelected(null)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            )}
        </>
    )
}