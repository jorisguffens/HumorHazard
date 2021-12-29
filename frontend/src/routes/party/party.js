import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {useDispatchParty, useDispatchPartyPlayers, useGame, useParty, usePlayer} from "../../redux/hooks";
import {usePacketHandler} from "../../socket/packetHandler";

import Register from "../../common/register/register";

import Lobby from "./lobby/lobby";
import Game from "./game/game";

export default function Party() {

    const navigate = useNavigate();
    const partyid = useParams()["party"];

    const packetHandler = usePacketHandler();
    const dispatchParty = useDispatchParty();
    const dispatchPartyPlayers = useDispatchPartyPlayers();

    const player = usePlayer();
    const party = useParty();
    const game = useGame();

    React.useEffect(function () {
        if (party != null) {
            // party already loaded
            if (party.id !== partyid) {
                // party id doesn't match
                navigate("/" + party.id);
            }
            return;
        }

        if (!partyid) {
            // invalid url
            navigate("/");
            return;
        }

        if (!player) {
            return;
        }

        packetHandler.sendc("PARTY_JOIN", {party: partyid}).then((party) => {
            dispatchParty(party);
        }).catch(err => {
            // party doesn't exist
            navigate("/");
        })
    }, [player, party, partyid, packetHandler, dispatchParty, navigate]);

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("PARTY_UPDATE", (party) => {
            if ( !party ) {
                navigate("/");
                return;
            }
            dispatchParty(party);
        });
        return () => unregister();
    }, [packetHandler, navigate, dispatchParty]);

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("PARTY_PLAYERS_UPDATE", (party) => {
            dispatchPartyPlayers(party);
        });
        return () => unregister();
    }, [packetHandler, navigate, dispatchParty]);

    if (!player) {
        return <Register/>
    }

    if ( !party ) {
        return null;
    }

    if ( !game ) {
        return <Lobby/>
    }

   return <Game/>
}