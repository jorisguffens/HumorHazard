import {useCallback, useEffect} from "react";
import {
    Divider,
    Grid,
    MenuItem,
    Select,
    Slider,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    useMediaQuery,
    useTheme
} from "@mui/material";

import {useDispatchPartySettings, usePartyPlayers, usePartySettings, usePlayer} from "../../../../redux/hooks";

import {usePacketHandler} from "../../../../socket/packetHandler";

import style from "./partySettings.module.scss";
import clsx from "clsx";

export default function PartySettings() {

    const partyPlayers = usePartyPlayers();
    const settings = usePartySettings();
    const dispatchSettings = useDispatchPartySettings();
    const packetHandler = usePacketHandler();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const disabled = partyPlayers[0].id !== usePlayer().id;

    const update = useCallback((key, value) => {
        settings[key] = value;
        dispatchSettings({...settings});
    }, [settings, dispatchSettings]);

    // update local values with changes received from the server
    useEffect(() => {
        if (!disabled) return;
        const unregister = packetHandler.registerTypeListener("PARTY_SETTINGS_UPDATE", (settings) => {
            dispatchSettings(settings);
        });
        return () => unregister();
    }, [disabled, packetHandler, dispatchSettings]);

    // only send updated settings to server when they were unchanged for 1 second
    useEffect(() => {
        if (disabled) return;
        const id = setTimeout(() => {
            packetHandler.sendc("PARTY_CHANGE_SETTINGS", settings);
        }, 1000);
        return () => clearTimeout(id);
    }, [disabled, settings, packetHandler]);

    return (
        <>
            <Grid container className={clsx(style.settingGroup, isMobile && style.settingGroupMobile)}>
                <Grid item xs={12} sm={6} className={style.settingLabel}>
                    Party visibility
                </Grid>
                <Grid item xs={12} sm={6} className={style.textCenter}>
                    <ToggleButtonGroup color="primary" value={settings.visible} exclusive disabled={disabled}
                                       onChange={(e, value) => update("visible", value)}>
                        <ToggleButton value={true}>Public</ToggleButton>
                        <ToggleButton value={false}>Private</ToggleButton>
                    </ToggleButtonGroup>
                    {/*<Switch checked={settings.visible} disabled={disabled}*/}
                    {/*        onChange={(e) => update("visible", !settings.visible)}/>*/}
                </Grid>
            </Grid>

            <Grid container className={clsx(style.settingGroup, isMobile && style.settingGroupMobile)}>
                <Grid item xs={12} sm={6} className={style.settingLabel}>
                    Player limit
                </Grid>
                <Grid item xs={12} sm={6} style={{display: "flex", alignItems: "center"}}>
                    <Stack spacing={2} direction="row" sx={{width: "calc(100% - 10px)"}} alignItems="center">
                        <div style={{width: "20px"}}>{settings.player_limit}</div>
                        <Slider size="medium" value={settings.player_limit} disabled={disabled}
                                valueLabelDisplay="auto" min={Math.max(3, partyPlayers.length)} max={10} step={1}
                                onChange={(e) => update("player_limit", e.target.value)}/>
                    </Stack>
                </Grid>
            </Grid>

            <Grid container className={clsx(style.settingGroup, isMobile && style.settingGroupMobile)}>
                <Grid item xs={12} sm={6} className={style.settingLabel}>
                    Score limit
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Stack spacing={2} direction="row" sx={{width: "calc(100% - 10px)"}} alignItems="center">
                        <div style={{width: "20px"}}>{settings.score_limit}</div>
                        <Slider size="medium" value={settings.score_limit} disabled={disabled}
                                valueLabelDisplay="auto" min={3} max={12} step={1}
                                onChange={(e) => update("score_limit", e.target.value)}/>
                    </Stack>
                </Grid>
            </Grid>

            <Grid container className={clsx(style.settingGroup, isMobile && style.settingGroupMobile)}>
                <Grid item xs={12} sm={6} className={style.settingLabel}>
                    Timer multiplier
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select
                        value={settings.timer_duration_multiplier}
                        componentsProps={{Input: {InputLabelProps: {shrink: false}}}}
                        label="" disabled={disabled} fullWidth
                        onChange={(e) => update("timer_duration_multiplier", e.target.value)}
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