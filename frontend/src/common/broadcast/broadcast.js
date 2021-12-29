import {usePacketHandler} from "../../socket/packetHandler";
import {Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Link} from "@mui/material";
import React, {useEffect, useState} from "react";

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export default function Broadcast() {

    const packetHandler = usePacketHandler();

    const [message, setMessage] = useState("");
    const [closable, setClosable] = useState(false);

    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("ALERT", (message) => {
            setClosable(false);

            message = message.split(" ").map(part => URL_REGEX.test(part) ?
                <Link href={part} target={"_blank"} rel={"noreferrer noopener"}>{part}</Link> : part + " ");
            setMessage(message);
        });
        return () => unregister();
    }, [packetHandler]);

    useEffect(() => {
        if (!message) return;
        const id = setTimeout(() => {
            setClosable(true)
        }, 2000);
        return () => clearTimeout(id);
    }, [message]);

    return (
        <Dialog open={!!message} maxWidth={"xs"} fullWidth>
            <DialogTitle>
                Announcement
            </DialogTitle>
            <DialogContent>
                {message}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setMessage(null)} disabled={!closable}>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}