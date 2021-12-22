import {useEffect} from "react";

import {connect, useSocketHandler} from "../../socket/handler";
import Register from "../../common/register/register";

export default function Landing() {

    const socketHandler = useSocketHandler();

    useEffect(() => {
        console.log(socketHandler);
    }, [socketHandler]);

    useEffect(() => {
        connect();
    }, []);

    return (
        <Register/>
    )
}