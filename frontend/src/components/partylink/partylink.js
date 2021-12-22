import React from "react";

import style from "./partylink.scss";
import {connect} from "react-redux";
import {Button, FormGroup, FormLabel, TextField, Tooltip} from "@mui/material";

function PartyLink({ party, showLabel }) {

    const linkRef = React.useRef(null);
    const link = process.env.REACT_APP_URL + "/" + party.id;

    function copyLink(e) {
        e.preventDefault();
        let el = linkRef.current;

        if ( el.selectionEnd === el.selectionStart ) {
            el.select();
        }

        if ( document.queryCommandSupported('copy') ) {
            document.execCommand('copy');
        }
    }

    return (
        <FormGroup>
            { showLabel ? (<FormLabel className={style.partyLinkInfo}>Share this link with your friends:</FormLabel>) : null }
            <TextField type="text" title="Click to copy" readOnly
                          className={style.partyLink}
                          value={link}
                          ref={linkRef}
            />
            <Tooltip
                placement="top"
                delay={{hide: 1000}}
                trigger="focus"
                overlay={
                    <Tooltip id={"tooltip-copy"}>Copied!</Tooltip>
                }
            >
                <Button variant="contained" onClick={copyLink} className={style.partyLinkCopy}>
                    <i className="far fa-copy" />
                </Button>
            </Tooltip>
        </FormGroup>
    )
}

function mapStateToProps(state) {
    const { party } = state;
    return {
        party: party
    };
}

export default connect(mapStateToProps)(PartyLink);