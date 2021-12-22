import React from "react";
import {connect} from "react-redux";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";

function Broadcast({broadcast}) {

    const [show, setShow] = React.useState(false);

    React.useEffect(function () {
        if (!broadcast) {
            return;
        }

        setShow(true);
    }, [broadcast]);

    return (
        <Dialog open={show} onClose={() => setShow(false)}>
            <DialogTitle>
                Broadcast
            </DialogTitle>
            <DialogContent>
                <p>{broadcast}</p>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setShow(false)}>Ok</Button>
            </DialogActions>
        </Dialog>
    )
}


function mapStateToProps(state) {
    const {broadcast} = state;
    return {
        broadcast
    };
}

export default connect(mapStateToProps)(Broadcast);