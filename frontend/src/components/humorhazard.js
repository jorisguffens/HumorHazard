import React from "react";
import {useSelector} from "react-redux";
import {Route, Routes, useNavigate, useParams} from "react-router-dom";

import {createHandler, useSocketHandler} from "../socket/handler";

import Party from "./party/party";
import Loader from "./loader/loader";
import PartyList from "./partylist/partylist";
import Register from "./register/register";

export default function HumorHazard() {

    const navigate = useNavigate();
    const partyid = useParams()["party"];

    const socketHandler = useSocketHandler();
    const party = useSelector((state) => state.party);
    const isConnected = useSelector(state => state.isConnected);

    // create connection based on partyid
    React.useEffect(() => {
        createHandler(partyid);
    }, []);

    // update url with party id
    React.useEffect(function () {
        if (party != null) {
            navigate("/" + party.id);
        }
    }, [party]);

    // leave on path change
    React.useEffect(function () {
        if (!isConnected || socketHandler == null) {
            return;
        }

        if (party != null && (partyid == null || partyid !== party.id)) {
            socketHandler.quitParty();
        }
    }, [partyid, socketHandler, isConnected])

    // connecting
    if (!isConnected) {
        return <Loader/>;
    }

    return (
        <Routes>
            <Route exact path="/" element={<PartyList/>}/>

            <Route path="/create" element={<Register/>}/>

            <Route path="/:party" element={<Party/>}/>
        </Routes>
    )
}