import React from "react";
import {connect} from "react-redux";
import {Link, useNavigate} from "react-router-dom";

import {useSocketHandler} from "../../socket/handler";

import style from "./partylist.scss";
import {Button, Grid} from "@mui/material";

function Partylist({ partylist }) {

    const socketHandler = useSocketHandler();
    const navigate = useNavigate();

    // remove party id from url
    React.useEffect(function() {
        navigate("/");
    }, []);

    React.useEffect(() => {
        socketHandler.refreshPartyList();
    }, []);

    React.useEffect(() => {
        const cleanup = setTimeout(() => {
            socketHandler.refreshPartyList();
        }, 30000);
        return () => {
            clearTimeout(cleanup);
        }
    }, []);

    return (
        <div className={style.verticalCenterWrapper}>
            <div className={style.verticalCenter}>
                <div className={style.container}>
                    <div className={style.card}>
                        <h1 className={style.title}>Humor Hazard</h1>
                    </div>

                    <div className={style.card}>
                        <div className={style.partyListHeader}>
                            <Grid container>
                                <Grid item>
                                    <h2 className={style.partyListTitle}>Public parties</h2>
                                </Grid>
                                <Grid item className={style.createPartyWrapper}>
                                    <Link to={"/create"}>
                                        <Button>Create party</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                        </div>

                        <div className={style.partyList}>
                            { partylist != null && partylist.length > 0 ? partylist.map((party, i) => {
                                return (
                                    <div key={i} className={style.party}>
                                        <Grid container noGutters={true}>
                                            <Grid item>
                                                <h3>{party.players[0].name + "'s game"}</h3>
                                            </Grid>
                                            <Grid item className={style.textRight}>
                                                <Link to={"/" + party.id}>
                                                    <Button variant={"primary"}>JOIN</Button>
                                                </Link>
                                            </Grid>
                                        </Grid>
                                        <Grid container noGutters={true}>
                                            <Grid item>
                                                <span>
                                                    { party.players.map((player) => {
                                                        return player.name
                                                    }).join(", ")}
                                                </span>
                                            </Grid>
                                            <Grid item className={style.textRight}>
                                                {party.players.length} / <strong>{party.playerLimit}</strong>
                                            </Grid>
                                        </Grid>
                                    </div>
                                )
                            }) : (<div className={style.emptyList}>No public parties are available.</div>) }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function mapStateToProps(state) {
    const { partylist } = state;
    return {
        partylist: partylist
    };
}

export default connect(mapStateToProps)(Partylist);