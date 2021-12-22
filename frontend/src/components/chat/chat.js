import React from "react";
import {connect} from "react-redux";

import {createPacket, useSocketHandler} from "../../socket/handler";

import style from "./chat.scss";
import {Button, FormGroup, TextField} from "@mui/material";

function Chat({ messages, height }) {

    const socketHandler = useSocketHandler();

    const initialRender = React.useRef(true);
    const wasVisible = React.useRef(false);
    const messagesRef = React.useRef(null);

    function isVisible() {
        let container = messagesRef.current;
        let rect = container.getBoundingClientRect();
        return (rect.top >= 0) && (rect.bottom <= window.innerHeight);

    }

    React.useEffect(function() {

        if ( isVisible() ) {
            wasVisible.current = true;
        }

        const onscroll = function() {
            if ( isVisible() ) {
                if ( wasVisible.current ) {
                    return;
                }

                wasVisible.current = true;
                let container = messagesRef.current;
                container.scrollTop = container.scrollHeight;
            } else {
                wasVisible.current = false;
            }
        };

        window.addEventListener("scroll", onscroll);
        return () => {
            window.removeEventListener("scroll", onscroll);
        }
    }, []);

    React.useEffect(function() {
        if ( messages === null || messages.length === 0 ) {
            return;
        }

        let container = messagesRef.current;

       if ( !isVisible() ) {
           return;
       }

        if ( initialRender.current ) {
            initialRender.current = false;
            container.scrollTop = container.scrollHeight;
            return;
        }

        let lengthToBottom = container.scrollHeight - (container.scrollTop + container.offsetHeight);
        if ( lengthToBottom < 50 ) {
            container.scrollTop = container.scrollHeight;
        }
    }, [messages]);

    const [message, setMessage] = React.useState("");

    function onSubmit(e) {
        e.preventDefault();

        if ( message === "" ) {
            return;
        }

        let packet = createPacket("SendMessage", {
            "text": message
        });
        socketHandler.send(packet);
        setMessage("");

        // always scroll on sending a message
        //messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }

    const msg = [];
    if ( messages !== null ) {
        for (let i = 0; i < messages.length; i++) {
            msg.push(
                <div key={i} className={style.message}>
                    <div className={style.messageSender}>{messages[i].sender}</div>
                    <div className={style.messageContent}>{messages[i].text}</div>
                </div>
            )
        }
    }

    return (
        <div className={style.chatWrapper} style={{height: height ? height : "auto"}}>
            <div className={style.messages} ref={messagesRef}>
                {msg}
            </div>
            <div className={style.input}>
                <FormGroup onSubmit={onSubmit}>
                    <TextField type="text" placeholder="Enter message" value={message} onChange={(e) => setMessage(e.target.value)}/>
                    <Button variant="contained" type="submit" className={style.sendButton}>
                        <i className="far fa-paper-plane" />
                    </Button>
                </FormGroup>
            </div>
        </div>
    )
}

function mapStateToProps(state) {
    const { player, party, messages } = state;
    return {
        player: player,
        party: party,
        messages: messages
    };
}

export default connect(mapStateToProps)(Chat);