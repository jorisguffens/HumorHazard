import {usePacketHandler} from "../../socket/packetHandler";
import {useEffect, useState} from "react";
import {Alert, Snackbar} from "@mui/material";

export default function ConnectionStatus() {

    const packetHandler = usePacketHandler();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        packetHandler.registerOpenListener(() => setOpen(false));
        packetHandler.registerCloseListener(() => setOpen(true));
    }, [packetHandler]);

    useEffect(() => {
        if (!open) return;
        const id = setTimeout(() => {
            window.location.reload();
        }, 30000);
        return () => clearTimeout(id);
    }, [open]);

    return (
        <Snackbar open={open} anchorOrigin={{vertical: "top", horizontal: "center"}}>
            <Alert severity={"error"}>
                Looks like you are disconnected. Trying to reconnect...
            </Alert>
        </Snackbar>
    )
}