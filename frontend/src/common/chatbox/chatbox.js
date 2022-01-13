import {useCallback, useEffect, useRef, useState} from "react";

import {useDispatchChatMessages, usePartyChatMessages} from "../../redux/hooks";
import {usePacketHandler} from "../../socket/packetHandler";

import {TextField} from "@mui/material";

import style from "./chatbox.module.scss";

export default function Chatbox() {

    const messages = usePartyChatMessages();
    const messagesRef = useRef();
    const [inputMessage, setInputMessage] = useState("");

    const dispatchChatMessages = useDispatchChatMessages();
    const packetHandler = usePacketHandler();

    // update local values with changes received from the server
    useEffect(() => {
        const unregister = packetHandler.registerTypeListener("PARTY_CHAT_MESSAGE", (message) => {
            dispatchChatMessages([...messages, message]);
        });
        return () => unregister();
    }, [packetHandler, messages, dispatchChatMessages]);

    const send = useCallback((event) => {
        event.preventDefault();
        if ( inputMessage.trim() === "" ) {
            return;
        }

        packetHandler.send("PARTY_CHAT_MESSAGE", inputMessage);
        setInputMessage("");
    }, [inputMessage, packetHandler]);

    useEffect(() => {
        if ( !!messages ) {
            return;
        }

        const container = messagesRef.current;
        const lengthToBottom = container.scrollHeight - (container.scrollTop + container.offsetHeight);
        if ( lengthToBottom < 50 || container.scrollTop === 0) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    return (
        <div className={style.root}>
            <div className={style.messages} ref={messagesRef}>
                {messages.map((item, i) => {
                    return (
                        <div key={i} className={style.message}>
                            <div>{item.sender}</div>
                            <div>{item.message}</div>
                        </div>
                    )
                })}
            </div>
            <div className={style.sendinput}>
                <form onSubmit={send}>
                    <TextField fullWidth value={inputMessage} placeholder={"Type your message here..."}
                        onChange={(e) => setInputMessage(e.target.value)}/>
                </form>
            </div>
        </div>
    )
}