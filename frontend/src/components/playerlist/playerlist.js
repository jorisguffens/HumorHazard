import React from "react";
import clsx from "clsx";

import style from "./playerlist.scss";
import {connect} from "react-redux";
import {Grid} from "@mui/material";


function PlayerList({ player, party, game, round}) {

    return (
        <ul className={clsx(style.playerList, "fa-ul")}>
            {party.players.map((p, i) => {
                let score = game.scores[p.id];
                let statusMessage;

                if ( game.scores[p.id] == null ) {
                    statusMessage = "Spectating...";
                } else {
                    let status = round.playerStatuses[p.id];
                    if (status === "picking") {
                        statusMessage = "Picking...";
                    } else if (status === "disconnected") {
                        statusMessage = "Disconnected...";
                    }
                }

                let icon;
                if ( i === 0 ) {
                    icon = (<span key={"a"}><i className={clsx("fas", "fa-crown")}/></span>);
                } else if ( game.scores[p.id] == null ) {
                    icon = (<span key={"b"}><i className={clsx("fas", "fa-eye")}/></span>);
                } else {
                    icon = (<span key={"c"}><i className={clsx("fas", "fa-user")}/></span>);
                }

                return (
                    <li key={i}>
                        <Grid container noGutters={true}>
                            <Grid item xs="auto">
                                <div className={style.playerListIcon}>
                                    { icon }
                                </div>
                            </Grid>
                            <Grid item >
                                <div>
                                    {p.id === player.id ? <strong>{p.name}</strong> : p.name}
                                </div>
                                <div className={style.secondRow}>
                                    { statusMessage }&nbsp;
                                </div>
                            </Grid>
                            <Grid item xs={2} className={style.textRight}>
                                <div>
                                    { score }
                                </div>
                                <div className={style.secondRow}>
                                    {round.judge === p.id ? (<span><i className="fas fa-gavel" /></span>) : null}
                                </div>
                            </Grid>
                        </Grid>
                    </li>
                )
            })}
        </ul>
    )
}

function mapStateToProps(state) {
    const { player, party, game, round } = state;
    return {
        player: player,
        party: party,
        game: game,
        round: round
    };
}

export default connect(mapStateToProps)(PlayerList);