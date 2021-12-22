import React from "react";

import styles from './loader.scss';
import clsx from "clsx";
import {add_notification} from "../../redux/actions";

export default function Loader() {

    const [visible, setVisible] = React.useState(false);

    React.useEffect(function () {
        setVisible(true);
    }, []);

    React.useEffect(function() {
        let id = setTimeout(function() {
            add_notification({
                "title": "Info",
                "variant": "info",
                "text": "The servers might be down, probably just an update. Try again in a few minutes :)"
            }, -1);
        }, 5000);
        return () => {
            clearTimeout(id);
        }
    }, []);

    return (
        <div className={styles.loader}>
            <div className={styles.verticalCenterWrapper}>
                <div className={styles.verticalCenter}>
                    <div className={clsx(styles.spinner, visible && styles.visible)}>
                        <i className="fas fa-circle-notch fa-4x fa-spin" />
                    </div>
                </div>
            </div>
        </div>
    )
}