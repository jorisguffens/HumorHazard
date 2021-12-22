import React from "react";

import FloatingBox from "../floatingbox/floatingbox";

import logo from "../../assets/img/logo.png";

import style from "./register.scss";
import {useSocketHandler} from "../../socket/handler";
import {Button, FormGroup, FormLabel, TextField} from "@mui/material";

export default function Register({ partyid }) {

    const socketHandler = useSocketHandler();

    const [name, setName] = React.useState("");
    const [submit, setSubmit] = React.useState(false);

    const [authenticating, setAuthenticating] = React.useState(false);

    React.useEffect(function() {
        if (localStorage.getItem("name") != null) {
            setName(localStorage.getItem("name"));
        }
    }, []);

    React.useEffect(function() {
        if ( name == null || !submit ) {
            return;
        }

        let data = {
            "name": name,
            "party": partyid
        };

        setAuthenticating(true);

        let unmounted = false;
        socketHandler.register(data).catch(() => null)
            .finally(() => {
                if ( unmounted ) return;
                setAuthenticating(false);
                setSubmit(false);
            });
        return () => {
            unmounted = true;
        }
    }, [submit]);

    const onSubmit = function(e) {
        e.preventDefault();

        if ( authenticating ) {
            return;
        }

        setSubmit(true);
    };

    return (
        <FloatingBox>
            <h1 className={style.title}>Humor Hazard</h1>
            <div className={style.center}>
                <img className={style.logo} src={logo} alt="" />
            </div>

            <br/>

            <FormGroup className={style.center} onSubmit={onSubmit}>
                    <FormLabel>Choose your Name</FormLabel><br/>
                    <TextField className={style.inputName} type="text" placeholder="Name" required autoFocus spellCheck="false"
                                  value={name} onChange={e => setName(e.target.value)}/>
                    <Button variant="primary" type="submit" className={style.startButton}>
                        <strong>GO</strong>
                    </Button>
            </FormGroup>

            <br/>

            <div className="copyright">
                <h3 className="center">Disclaimer</h3>
                <p>
                    <a href="https://humorhazard.com">Humor Hazard</a> is an online version of <a href="https://amzn.to/3eywzAK" target="_blank">Joking Hazard&trade;</a>.
                    &nbsp;The rights of the game and images used belong to <a href="https://amzn.to/3eywzAK" target="_blank">Joking Hazard&trade;</a>
                </p>
                <p>
                    Report issues, bugs, problems, etc. at the <a href="https://github.com/jorisguffens/HumorHazard/issues">Github Issue Tracker</a>.
                </p>
            </div>
        </FloatingBox>
    );
}