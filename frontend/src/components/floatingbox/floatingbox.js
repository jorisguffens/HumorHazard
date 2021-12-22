import React from "react";

import style from './floatingbox.scss';

export default function FloatingBox(props) {

    let styleOverride = {};
    if ( props.width ) {
        styleOverride.width = props.width;
    }

    return (
        <div className={style.verticalCenterWrapper}>
            <div className={style.verticalCenter}>
                <div className={style.floatingBox} style={styleOverride}>
                    {props.children}
                </div>
            </div>
        </div>
    )

}