import {useParty, usePartyPlayers, usePlayer} from "../../../../redux/hooks";

import style from "./playerList.module.scss"
import clsx from "clsx";

export default function PlayerList() {

    const player = usePlayer();
    const party = useParty();
    const partyPlayers = usePartyPlayers();

    const elements = [];
    for ( let i = 0; i < partyPlayers.length; i++ ) {
        const p = partyPlayers[i];
        let icon = "fa-user";
        if ( party.winner && party.winner.id === p.id ) {
            icon = "fa-crown"
        } else if ( i === 0 ) {
            icon = "fa-user-tie"
        }
        elements.push(
            <div className={style.item} key={i} style={{color: p.id === player.id ? "#ff412c" : "inherit"}}>
                <span key={icon}><i className={clsx("fas", icon)}/></span>
                <span>{p.name}</span>
            </div>
        )
    }
    return (
        <div>
            {elements}
        </div>
    )
}