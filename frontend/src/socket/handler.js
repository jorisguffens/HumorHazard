import React, {useEffect, useState} from 'react';
import {Socket} from "./socket";
import {v4 as uuidv4} from "uuid";

function createPacket(type, payload) {
    const packet = { type };
    if ( payload !== null && payload !== undefined ) {
        packet.payload = payload;
    }
    return packet;
}

function Handler(uri) {

    const callbacks = {};
    const listeners = [];

    const socket = new Socket(uri);
    socket.connect();

    socket.registerListener('receive', (json) => {
        if ( json.callback != null && callbacks[json.callback] != null ) {
            callbacks[json.callback](json.payload);
            delete callbacks[json.callback];
        } else {
            for (let i = 0; i < listeners.length; i++ ) {
                listeners[i](json);
            }
        }
    })

    this.send = function(type, payload) {
        socket.send(createPacket(type, payload));
    };

    this.sendc = function(type, payload) {
        return new Promise(function(resolve, reject) {
            const func = (json) => {
                if (json.error) {
                    reject(json.error);
                    return;
                }
                resolve(json);
            }

            const id = uuidv4();
            callbacks[id] = func;

            const packet = createPacket(type, payload);
            packet["callback"] = id;
            socket.send(packet);

            setTimeout(function() {
                if ( callbacks[id] != null ) {
                    delete callbacks[id];
                    reject("Callback timed out.");
                }
            }, 3000);
        });
    }

    this.registerListener = function(func) {
        if ( typeof func !== "function" ) return;

        listeners.push(func);
        return function() {
            let index = listeners.indexOf(func);
            if ( index !== -1 ) {
                listeners.splice(index, 1);
                return true;
            }
            return false;
        }
    };

}

let handler;
let handlerSubscribers = [];

export function connect(partyid) {
    fetch("/config.json").then(res => {
        return res.json();
    }).then(json => {
        const servers = json['servers'];

        if ( partyid == null ) {
            handler = new Handler(Object.values(servers)[0]);
            handlerSubscribers.forEach(item => item(handler));
            return;
        }

        for ( let letter of Object.keys(servers) ) {
            if ( !partyid.startsWith(letter) ) continue;
            handler = new Handler(servers[letter]);
            handlerSubscribers.forEach(item => item(handler));
            return
        }
    });
}

export function useSocketHandler() {
    const [handler, setHandler] = useState();

    useEffect(() => {
        const func = (h) => setHandler(h);
        handlerSubscribers.push(func)
        return () => handlerSubscribers = handlerSubscribers.filter(f => f !== func);
    }, []);

    return handler;
}