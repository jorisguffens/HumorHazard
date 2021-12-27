import React from "react";
import clsx from "clsx";

import {Button} from "@mui/material";

import cardBackside from '../../../../assets/img/card-backside2.jpg'

import style from "./card.module.scss";

export default function Card({card, onClick}) {

    if (!card) {
        return (
            <div className={clsx(style.card, !onClick && style.disabled)}>
                <img src={cardBackside} alt=""/>
            </div>
        )
    }

    return (
        <div className={clsx(style.card, !onClick && style.disabled)}>
            <img src={"/img/cards/" + card.image} alt=""/>
            {onClick && (
                <div className={style.overlay} onClick={onClick}>
                    <Button>Select</Button>
                </div>
            )}
        </div>
    )
}