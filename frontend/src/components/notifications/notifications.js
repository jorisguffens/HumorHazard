import React from "react";
import {connect} from "react-redux";

import {del_notification} from "../../redux/actions";

import style from "./notifications.scss";
import {Alert, Fade} from "@mui/material";

function Notifications({ notifications }) {

    function close(id) {
        del_notification(id);
    }

    const alerts = [];

    for ( let i = notifications.length-1; i >= 0; i-- ) {
        let n = notifications[i];

        let header = null;
        if ( n.title !== null ) {
            header = n.title
        }

        alerts.push(
            <div key={i}>
                <Fade appear={true} in={true} mountOnEnter={true}>
                    <Alert variant={n.variant} onClose={() => close(n.id)} dismissible>
                        {header}
                        <p>
                            {n.text}
                        </p>
                    </Alert>
                </Fade>
            </div>
        );
        break;
    }

    return (
        <div className={style.notifications} >
            {alerts}
        </div>
    )
}

function mapStateToProps(state) {
    const { notifications } = state;
    return {
        notifications
    };
}

export default connect(mapStateToProps)(Notifications);