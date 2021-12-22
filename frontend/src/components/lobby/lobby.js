import React from "react";
import {connect} from "react-redux";
import clsx from "clsx";

import {createPacket, useSocketHandler} from "../../socket/handler";

import FloatingBox from "../floatingbox/floatingbox";
import PartyLink from "../partylink/partylink";
import GameSettings from "../gamesettings/gamesettings";

import style from "./lobby.scss";
import Chat from "../chat/chat";
import {Button, Grid} from "@mui/material";

function Lobby({player, party}) {

    const socketHandler = useSocketHandler();

    function startGame() {
        socketHandler.send(createPacket("StartGame", null));
    }

    let footerWarning = null;
    if (party.players.length < 3) {
        let amount = 3 - party.players.length;
        footerWarning = (
            <span>You need {amount} more {amount === 1 ? "player" : "players"} to start the game.</span>
        )
    } else if (party.players[0].id !== player.id) {
        footerWarning = (
            <span>The party owner must start the game.</span>
        )
    }

    return (
        <FloatingBox width={"800px"}>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <h1 className={style.title}>Humor Hazard</h1>
                </Grid>
                <Grid item xs={12} md={6}>
                    <div className={style.partyLinkWrapper}>
                        <div className={style.partyLink}>
                            <PartyLink/>
                        </div>
                    </div>
                </Grid>
            </Grid>

            <hr className={style.hr}/>

            <Grid container className={style.bodyRow}>
                <Grid item className={style.playersColumn} xs={12} sm={6}>
                    <h2 className={style.bodyTitle}>Players</h2>
                    <ul className={clsx(style.playerList, "fa-ul")}>
                        {party.players.map((p, i) => {
                            return (
                                <li key={i}>
                                    <span className={style.playerListIcon}>
                                        <i className={clsx("fas", {"fa-crown": i === 0, "fa-user": i !== 0})}
                                        />
                                    </span>
                                    <span className={style.playerListName}>
                                        {p.id === player.id ? <strong>{p.name}</strong> : p.name}
                                    </span>
                                </li>
                            )
                        })}
                    </ul>

                    <div className={style.footer}>
                        {footerWarning}

                        {player.id === party.players[0].id ? (
                            <div>
                                <Button variant="primary" className={style.startButton} onClick={startGame}
                                        disabled={party.players.length < 3}>
                                    Start Game
                                </Button>
                            </div>
                        ) : null}
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <div className={style.bodyFlex}>
                        <div className={style.gameSettings}>
                            <h2 className={style.bodyTitle}>Settings</h2>
                            <GameSettings/>
                        </div>

                        <div className={style.chatTitle}>
                            <br/>
                            <h2 className={style.bodyTitle}>Chat</h2>
                        </div>

                        <div className={style.chat}>
                            <Chat height={"250px"}/>
                        </div>
                    </div>
                </Grid>
            </Grid>
        </FloatingBox>
    );
}

function mapStateToProps(state) {
    const {player, party} = state;
    return {
        player: player,
        party: party
    };
}

export default connect(mapStateToProps)(Lobby);