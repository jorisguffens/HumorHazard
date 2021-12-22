import React from "react";
import {connect} from "react-redux";
import clsx from "clsx";

import {createPacket, useSocketHandler} from "../../socket/handler";

import style from "./gamesettings.scss";
import {Checkbox, FormGroup, FormLabel, Grid, TextField} from "@mui/material";

function GameSettings({player, party}) {

    const socketHandler = useSocketHandler();

    const [publicGame, setPublicGame] = React.useState(false);
    const [scoreLimit, setScoreLimit] = React.useState(8);
    const [playerLimit, setPlayerLimit] = React.useState(10);

    const [update, setUpdate] = React.useState(false);

    React.useEffect(function () {
        if (!party.gameSettings) {
            return;
        }

        setPublicGame(party.gameSettings.publicGame);
        setScoreLimit(party.gameSettings.scoreLimit);
        setPlayerLimit(party.gameSettings.playerLimit);
    }, [party]);

    React.useEffect(() => {
        if (update === false) {
            return;
        }

        if (player.id !== party.players[0].id) {
            return;
        }

        let id = setTimeout(function () {
            let data = {
                "scoreLimit": scoreLimit,
                "playerLimit": playerLimit,
                "publicGame": publicGame
            };

            let packet = createPacket("SetGameSettings", data);
            socketHandler.send(packet);
        }, 1000);
        return () => {
            clearTimeout(id);
        }
    }, [update]);

    function changePlayerLimit(e) {
        setPlayerLimit(e.target.value);
        setUpdate("playerLimit" + e.target.value);
    }

    function changeScoreLimit(e) {
        setScoreLimit(e.target.value);
        setUpdate("scoreLimit" + e.target.value);
    }

    function changePublicGame(e) {
        setPublicGame(!publicGame);
        setUpdate("public game" + !publicGame);
    }

    const disabled = party.players[0].id !== player.id;
    return (
        <div className={style.gameSettings}>

            <FormGroup className={style.formGroup}>
                <Grid container>
                    <Grid item sm={6}>
                        <FormLabel>
                            Public party
                        </FormLabel>
                    </Grid>
                    <Grid item sm={6}>
                        <div className={style.verticalCenterWrapper}>
                            <div className={style.verticalCenter}>
                                <Checkbox className={clsx(style.switch, disabled && style.switchDisabled)}
                                          type="switch" label="" id="publicGameSwitch"
                                          onChange={(e) => changePublicGame(e)}{...{
                                    checked: publicGame,
                                    disabled: disabled
                                }} />
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </FormGroup>

            <FormGroup className={style.formGroup}>
                <Grid container>
                    <Grid item sm={6}>
                        <FormLabel column>
                            Player limit
                        </FormLabel>
                    </Grid>
                    <Grid item sm={6}>
                        <div className={style.verticalCenterWrapper}>
                            <div className={style.verticalCenter}>
                                <div className={style.range}>
                                    <TextField type="range" min={Math.max(3, party.players.length)} max="10" step="1"
                                              custom value={playerLimit}
                                              onChange={(e) => changePlayerLimit(e)} {...{disabled: disabled}}/>
                                </div>
                                <div className={style.rangeValue}>
                                    {playerLimit}
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </FormGroup>

            <FormGroup className={style.formGroup}>
                <Grid container>
                    <Grid item sm={6}>
                        <FormLabel>
                            Score limit
                        </FormLabel>
                    </Grid>
                    <Grid item sm={6}>
                        <div className={style.verticalCenterWrapper}>
                            <div className={style.verticalCenter}>
                                <div className={style.range}>
                                    <TextField type="range" min="3" max="16" step="1" custom value={scoreLimit}
                                                  onChange={(e) => changeScoreLimit(e)} {...{disabled: disabled}}/>
                                </div>
                                <div className={style.rangeValue}>
                                    {scoreLimit}
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </FormGroup>
        </div>
    );
}

function mapStateToProps(state) {
    const {player, party} = state;
    return {
        player: player,
        party: party
    };
}

export default connect(mapStateToProps)(GameSettings);