import {useCallback, useEffect} from "react";
import {Grid, MenuItem, Select, Slider, Switch} from "@mui/material";

import {useDispatchPartySettings, usePartyPlayers, usePartySettings, usePlayer} from "../../../../redux/hooks";

import {usePacketHandler} from "../../../../socket/packetHandler";

import style from "./partySettings.module.scss";

export default function PartySettings() {

    const settings = usePartySettings();
    const dispatchSettings = useDispatchPartySettings();
    const packetHandler = usePacketHandler();

    const disabled = usePartyPlayers()[0].id !== usePlayer().id;

    const update = useCallback((key, value) => {
        settings[key] = value;
        dispatchSettings({...settings});
    }, [settings, dispatchSettings]);

    // update local values with changes received from the server
    useEffect(() => {
        if ( !disabled ) return;
        const unregister = packetHandler.registerTypeListener("PARTY_UPDATE_SETTINGS", (settings) => {
            dispatchSettings(settings);
        });
        return () => unregister();
    }, [disabled, packetHandler, dispatchSettings]);

    // only send updated settings to server when they were unchanged for 1 second
    useEffect(() => {
        if ( disabled ) return;
        const id = setTimeout(() => {
            packetHandler.sendc("PARTY_CHANGE_SETTINGS", settings);
        }, 1000);
        return () => clearTimeout(id);
    }, [disabled, settings, packetHandler]);

    return (
        <>
            <Grid container className={style.settingGroup}>
                <Grid item xs={6} className={style.settingLabel}>
                    Public visible
                </Grid>
                <Grid item xs={6}>
                    <Switch checked={settings.visible} disabled={disabled}
                            onChange={(e) => update("visible", !settings.visible)}/>
                </Grid>
            </Grid>

            <Grid container className={style.settingGroup}>
                <Grid item xs={6} className={style.settingLabel}>
                    Player limit
                </Grid>
                <Grid item xs={6}>
                    <Slider size="medium" value={settings.player_limit} disabled={disabled}
                            valueLabelDisplay="auto" min={3} max={10} step={1}
                            onChange={(e) => update("player_limit", e.target.value)}/>
                </Grid>
            </Grid>

            <Grid container className={style.settingGroup}>
                <Grid item xs={6} className={style.settingLabel}>
                    Score limit
                </Grid>
                <Grid item xs={6}>
                    <Slider size="medium" value={settings.score_limit} disabled={disabled}
                            valueLabelDisplay="auto" min={3} max={12} step={1}
                            onChange={(e) => update("score_limit", e.target.value)}/>
                </Grid>
            </Grid>

            <Grid container className={style.settingGroup}>
                <Grid item xs={6} className={style.settingLabel}>
                    Timer multiplier
                </Grid>
                <Grid item xs={6}>
                    <Select
                        value={settings.timer_duration_multiplier} componentsProps={{Input: {InputLabelProps: {shrink: false}}}}
                        label="" disabled={disabled} onChange={(e) => update("timer_duration_multiplier", e.target.value)}
                    >
                        <MenuItem value={0}>Disabled</MenuItem>
                        <MenuItem value={1}>1x</MenuItem>
                        <MenuItem value={2}>2x</MenuItem>
                        <MenuItem value={4}>4x</MenuItem>
                    </Select>
                </Grid>
            </Grid>

        </>
    )
}