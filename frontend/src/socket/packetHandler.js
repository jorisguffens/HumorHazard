import {createContext, useContext, useEffect, useState} from 'react';
import {Socket} from "./socket";
import {v4 as uuidv4} from "uuid";

function createPacket(type, payload) {
    const packet = {type};
    if (payload !== null && payload !== undefined) {
        packet.payload = payload;
    }
    return packet;
}

function PacketHandler(socket) {

    const callbacks = {};
    const listeners = [];

    socket.registerListener('receive', (json) => {
        if (json.callback != null && callbacks[json.callback] != null) {
            callbacks[json.callback](json.payload);
            delete callbacks[json.callback];
        } else {
            for (let i = 0; i < listeners.length; i++) {
                listeners[i](json);
            }
        }
    });

    this.send = function (type, payload) {
        socket.send(createPacket(type, payload));
    };

    this.sendc = function (type, payload) {
        const promise = new Promise(function (resolve, reject) {
            const func = (json) => {
                if (json && json.error) {
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

            setTimeout(function () {
                if (callbacks[id] != null) {
                    delete callbacks[id];
                    reject("Callback timed out.");
                }
            }, 3000);
        });
        promise.catch(err => {
            console.error(err);
        })
        return promise;
    }

    this.registerTypeListener = function (type, func) {
        if (typeof func !== "function") return;
        return this.registerListener((packet) => {
            if (packet.type !== type) return;
            func(packet.payload);
        })
    }

    this.registerListener = function (func) {
        if (typeof func !== "function") return;

        listeners.push(func);
        return function () {
            let index = listeners.indexOf(func);
            if (index !== -1) {
                listeners.splice(index, 1);
                return true;
            }
            return false;
        }
    };

    this.registerOpenListener = function(func) {
        socket.registerListener("open", func);
    }

    this.registerCloseListener = function(func) {
        socket.registerListener("close", func);
    }
}

const PacketHandlerContext = createContext(null);
export function PacketHandlerProvider({children}) {

    const [value, setValue] = useState(null);

    useEffect(() => {
        const socket = new Socket(process.env.REACT_APP_WS);
        const packetHandler = new PacketHandler(socket);

        socket.registerListener('open', () => {
            setValue(packetHandler);
        });

        socket.connect();
    }, [])

    return (
        <PacketHandlerContext.Provider value={value}>
            {children}
        </PacketHandlerContext.Provider>
    )
}

export function usePacketHandler() {
    return useContext(PacketHandlerContext);
}