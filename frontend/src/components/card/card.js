import React from "react";
import clsx from "clsx";

import style from "./card.scss";

import cardBackside from '../../assets/img/card-backside2.jpg'
import cardUnknown  from '../../assets/img/card-unknown.png';

export default function Card(props) {

    if ( props.flipped ) {
        return (
            <div className={clsx(style.card, props.disabled && style.disabled)}>
                <img src={cardBackside} alt=""/>
            </div>
        )
    }

    if ( props.resource == null ) {
        return (
            <div className={clsx(style.card, props.disabled && style.disabled)}>
                <img src={cardUnknown} alt=""/>
            </div>
        )
    }

    return (
        <div className={clsx(style.card, props.disabled && style.disabled)}>
            <img src={"/img/cards/" + props.resource} alt=""/>
        </div>
    )
}