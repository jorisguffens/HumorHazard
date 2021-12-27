import {usePartyPlayers, usePlayer} from "../../../../redux/hooks";

import style from "./playerList.module.scss"
import clsx from "clsx";

export default function PlayerList() {

    const player = usePlayer();
    const partyPlayers = usePartyPlayers();

    const elements = [];
    for ( let i = 0; i < partyPlayers.length; i++ ) {
        const p = partyPlayers[i];
        const icon = i === 0 ? "fa-user-tie" : "fa-user";
        elements.push(
            <div className={style.item} key={i} style={{color: p.id === player.id ? "#ff412c" : "inherit"}}>
                <span><i className={clsx("fas", icon)}/></span>
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