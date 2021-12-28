import clsx from "clsx";

import {useGameParticipants, useGameRound, usePartyPlayers, usePlayer, useRoundStatus} from "../../../../redux/hooks";

import style from "./playerList.module.scss";


export default function PlayerList() {

    const player = usePlayer();
    const partyPlayers = usePartyPlayers();
    const participants = useGameParticipants();
    const round = useGameRound();
    const state = useRoundStatus();

    const elements = [];
    for (let i = 0; i < partyPlayers.length; i++) {
        const p = partyPlayers[i];
        const gp = participants[p.id];
        let icon = "fas fa-user";
        if (i === 0) {
            icon = "fas fa-user-tie"
        } else if (!gp) {
            icon = "far fa-eye"
        }

        let status = "";
        if (!gp) {
            status = "Spectating"
        } else if (gp.disconnected) {
            status = "Disconnected"
        } else if (state === "PICKING" && round.picked_players.indexOf(p.id) === -1 && p.id !== round.judge.id) {
            if (round.start_cards.length === 2) {
                status = "Picking a card...";
            } else {
                status = "Picking cards...";
            }
        } else if (state === "FILLING" && p.id === round.judge.id) {
            status = "Picking a card...";
        } else if (state === "CHOOSING_WINNER" && p.id === round.judge.id) {
            status = "Choosing the winner...";
        }

        elements.push(
            <div className={clsx(style.item, p.id === player.id && style.self)} key={i}>
                <div className={style.itemPlayer}>
                    <div>
                        <i className={icon}/>&nbsp;&nbsp; {p.name}
                    </div>
                    <div>
                        {status}
                    </div>
                </div>
                {gp && (
                    <div className={style.itemInfo}>
                        <div>{gp.score}</div>
                        {p.id === round.judge.id && (<div><i className="fas fa-gavel" key={p.id + i}/></div>)}
                    </div>
                )}
            </div>
        )
    }
    return (
        <div>
            {elements}
        </div>
    )
}