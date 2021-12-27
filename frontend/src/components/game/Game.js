import React from "react";
import {connect} from "react-redux";
import clsx from "clsx";

import PlayerList from "../playerlist/playerlist";
import Hand from "../hand/hand";
import Card from "../../routes/party/game/card/card";
import Picks from "../picks/picks";
import PartyLink from "../../common/partylink/partylink";
import Chat from "../chat/chat";

import style from './game.scss';
import {Grid} from "@mui/material";

function Game({ player, party, game, round, countdown }) {

    const [previousStatus, setPreviousStatus] = React.useState(null);
    const [hasPicked, setHasPicked] = React.useState(null);

    React.useEffect(function() {
        if ( round == null || round.status === previousStatus ) {
            return;
        }
        setPreviousStatus(round.status);
        setHasPicked(false);
    }, [round]);

    if ( party == null || game == null || round == null ) {
        return null;
    }

    function getPlayer(id) {
        for ( let i = 0; i < party.players.length; i++ ) {
            if ( party.players[i].id === id ) return party.players[i];
        }
    }

    function status() {
        if ( round.status === "filling" ) {
            if ( round.judge === player.id ) {
                return "Pick a card";
            } else {
                return (<span>Waiting for <span className={style.highlight}>{getPlayer(round.judge).name}</span> to pick a card</span>);
            }
        }
        if ( round.status === "picking" ) {
            if ( !hasPicked && round.judge !== player.id && round.playerStatuses[player.id] != null) {
                if ( round.card.type === "red" ) {
                    return "Pick 2 cards";
                } else {
                    return "Pick a card";
                }
            } else {
                return "Waiting for the other players to pick a card";
            }
        }
        if ( round.status === "selecting_winner" ) {
            if ( round.judge === player.id ) {
                return "Choose a winner";
            } else {
                return (<span>Waiting for <span className={style.highlight}>{getPlayer(round.judge).name}</span> to choose the winner</span>);
            }
        }
        if ( round.status === "finished" ) {
            if ( round.winner !== "undefined" ) {
                return (<span>The winner is <span className={style.highlight}>{getPlayer(round.winner).name}</span></span>);
            } else {
                return "";
            }
        }
        return "";
    }

    return (
        <div className={style.verticalCenterWrapper}>
            <div className={style.verticalCenter}>
                <div className={style.gameWrapper}>
                    <div className={style.header}>
                        <Grid container>
                            <Grid item sm={12} md={4}>
                                <h1 className={style.title}>Humor Hazard</h1>
                            </Grid>
                            <Grid item sm={4} md={4}>
                                <h1 className={style.roundNumber}>Round: {game.roundNumber}</h1>
                            </Grid>
                            <Grid item sm={8} md={4}>
                                <PartyLink/>
                            </Grid>
                        </Grid>
                    </div>


                    <div className={style.table}>

                        {
                            round.card.type !== "red" ? (
                                <>
                                    <div className={style.main}>
                                        <div className={style.card}>
                                            <Card className={style.card} resource={round.card != null ? round.card.resource : null} />
                                        </div>
                                        <div className={style.card}>
                                            <Card className={style.card} resource={round.fillCard != null ? round.fillCard.resource : null} />
                                        </div>
                                    </div>
                                    <Picks />
                                </>
                            ) : (
                                <>
                                    <Picks />
                                    <div className={clsx(style.main, style.bonusRoundMain)}>
                                        <div className={style.card}>
                                            <Card className={style.card} resource={round.card != null ? round.card.resource : null} />
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>

                    <Hand complete={() => setHasPicked(true)}/>

                    <div className={style.statusBar}>
                        <Grid container>
                            <Grid item>
                                <div className={style.status}>
                                    <i className="fas fa-exclamation"/> &nbsp; {status()}
                                </div>
                            </Grid>
                            <Grid item xs={2} md={1}>
                                <div className={style.timer}>
                                    {countdown >= 0 ? countdown : null}
                                </div>
                            </Grid>
                        </Grid>
                    </div>

                    <div className={style.info}>
                        <Grid container>
                            <Grid item md="4" sm="5" xs="6">
                                <PlayerList/>
                            </Grid>
                            <Grid item md="8" sm="7" xs="6">
                                <div className={style.chat}>
                                    <Chat height={"250px"} />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { player, party, game, round, countdown } = state;
    return {
        player: player,
        party: party,
        game: game,
        round: round,
        countdown: countdown
    };
}

export default connect(mapStateToProps)(Game);