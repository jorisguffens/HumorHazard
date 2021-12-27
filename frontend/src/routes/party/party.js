import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {useDispatchParty, useParty, usePartyGame, usePlayer} from "../../redux/hooks";
import {usePacketHandler} from "../../socket/packetHandler";

import Register from "../../common/register/register";

import Lobby from "./lobby/lobby";
import Game from "./game/game";

export default function Party() {

    const navigate = useNavigate();
    const partyid = useParams()["party"];

    const packetHandler = usePacketHandler();
    const dispatchParty = useDispatchParty();

    const player = usePlayer();
    const party = useParty();
    const game = usePartyGame();

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

        // if (!player) {
        //     packetHandler.sendc("PARTY_INFO", {party: partyid}).catch(err => {
        //         // party doesn't exist
        //         navigate("/");
        //     });
        //     return;
        // }

        packetHandler.sendc("PARTY_JOIN", {party: partyid}).then((party) => {
            dispatchParty(party);
        }).catch(err => {
            // party doesn't exist
            navigate("/");
        })
    }, [player, partyid]);

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("PARTY_UPDATE", (party) => {
            dispatchParty(party);
        });
        return () => unregister();
    })

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