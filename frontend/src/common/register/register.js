import {useCallback, useState} from "react";

import {Container, FormLabel, Link, Paper, TextField, Typography} from "@mui/material";
import {useSocketHandler} from "../../socket/handler";

import Center from "../../common/center/center";

import logo from "../../assets/img/logo.png";

import style from "./register.module.scss";

export default function Register() {

    const socketHandler = useSocketHandler();
    const [name, setName] = useState("");

    const submit = useCallback((e) => {
        e.preventDefault();
        if ( !name ) return;

        console.log("submitted");
        socketHandler.sendc("REGISTER", { name }).then((res) => {
            console.log(res)
        }).catch(err => {
            console.error(err);
        })
    }, [name]);

    return (
        <Center>
            <Container maxWidth="xs">
                <Paper className={style.wrapper}>
                    <Typography variant="h4" component="h1">
                        Humor Hazard
                    </Typography>

                    <img src={logo} alt=""/>
                    <br/><br/>

                    <form onSubmit={submit}>
                        <FormLabel>Choose your name</FormLabel><br/><br/>
                        <TextField placeholder="Name" required autoFocus spellCheck="false" fullWidth
                                   value={name} onChange={e => setName(e.target.value)}/>
                    </form>
                    <br/><br/>

                    <div>
                        <Typography variant="h5" component="h2">
                            Disclaimer
                        </Typography>
                        <p>
                            Humor Hazard is an online version of
                            &nbsp;<Link href="https://amzn.to/3eywzAK">Joking Hazard&trade;</Link>.
                            The rights of the game and images used belong to
                            &nbsp;<Link href="https://amzn.to/3eywzAK">Joking Hazard&trade;</Link>
                        </p>
                    </div>
                </Paper>
            </Container>
        </Center>
    )
}