import React, {useEffect} from "react";
import {useNavigate, useParams} from "react-router-dom";

import {useDispatchParty, useParty, usePlayer} from "../../redux/hooks";
import {usePacketHandler} from "../../socket/packetHandler";
import Register from "../../common/register/register";
import Lobby from "./lobby/lobby";

export default function Party() {

    const navigate = useNavigate();
    const partyid = useParams()["party"];

    const packetHandler = usePacketHandler();
    const dispatchParty = useDispatchParty();

    const player = usePlayer();
    const party = useParty();

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
            packetHandler.sendc("INFO_PARTY", {party: partyid}).catch(err => {
                // party doesn't exist
                navigate("/");
            });
            return;
        }

        packetHandler.sendc("JOIN_PARTY", {party: partyid}).then((party) => {
            dispatchParty(party);
        }).catch(err => {
            // party doesn't exist
            navigate("/");
        })
    }, [player, partyid]);

    useEffect(() => {
        const unregister = packetHandler.registerListener((packet) => {
            if ( packet.type !== "UPDATE_PARTY") return;
            dispatchParty(packet.payload);
        });
        return () => unregister();
    })

    if (!player) {
        return <Register/>
    }

    if ( !party ) {
        return null;
    }

    return <Lobby/>
}