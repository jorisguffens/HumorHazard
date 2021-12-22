import React from "react";
import {connect} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";

import {useSocketHandler} from "../../socket/handler";

import Register from "../register/register";
import Lobby from "../lobby/lobby";
import Game from "../game/Game";
import Loader from "../loader/loader";

function Party({ player, party }) {

    const socketHandler = useSocketHandler();
    const navigate = useNavigate();

    const partyid = useParams()["party"];
    const [loading, setLoading] = React.useState(true);
    const [authenticating, setAuthenticating] = React.useState(false);

    // check if party exists
    React.useEffect(function() {
        let unmounted = false;
        socketHandler.partyCheck(partyid).then(() => {
            setLoading(false);
        }).catch(() => {
            navigate("/");
        });

        return () => {
            unmounted = true;
        }
    }, []);

    // login after disconnect / page refresh
    React.useEffect(function() {
        if ( !loading ) {
            return;
        }

        // check if the partyid is different from the party in memory (party switch)
        const prevParty = sessionStorage.getItem("party");
        if ( prevParty != null && prevParty !== partyid) {
            if ( party != null ) {
                // the player must quit the previous party
                socketHandler.quitParty();
            }
            return;
        }

        let unmounted = false;
        setAuthenticating(true);
        socketHandler.login().catch(() => null).finally(() => {
            setAuthenticating(false);
        })

        return () => {
            unmounted = true;
        }
    }, [loading]);

    if ( loading || authenticating ) {
        return <Loader/>;
    }

    // authenticate
    if ( player == null ) {
        return <Register partyid={partyid}/>;
    }

    // lobby
    if ( !party.ingame ) {
        return <Lobby/>;
    }

    // game
    return <Game/>;
}

function mapStateToProps(state) {
    const { player, party } = state;
    return {
        player: player,
        party: party,
    };
}

export default connect(mapStateToProps)(Party);