import React, {useCallback, useMemo, useState} from "react";

import {Button, Grid, TextField, Tooltip} from "@mui/material";
import {useParty} from "../../redux/hooks";

import style from "./partylink.module.scss";

export default function PartyLink() {

    const party = useParty();
    const [copied, setCopied] = useState(false);

    const link = useMemo(() => {
        return window.location.origin + "/" + party.id;
    }, [party]);

    const copy = useCallback((e) => {
        e.preventDefault();
        const textArea = document.createElement("textarea");
        textArea.value = link;

        // Avoid scrolling to bottom
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
    }, [link]);

    return (
        <div className={style.wrapper}>
            <Grid container spacing={1}>
                <Grid item xs={12} md={10}>
                    <TextField type="text" disabled variant={"outlined"} label={""} fullWidth
                               InputLabelProps={{shrink: false}} value={link}/>
                </Grid>
                <Grid item xs={12} md={2}>
                    <Tooltip open={copied} onClose={() => setCopied(false)}
                             leaveDelay={1000} placement="top" title={"Copied!"}>
                        <Button variant="contained" onClick={copy} fullWidth className={style.button}>
                            <i className="far fa-copy"/>
                        </Button>
                    </Tooltip>
                </Grid>
            </Grid>
        </div>
    )
}