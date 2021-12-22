import {store} from '../redux/store';
import uuid from "uuid";

export const SET_CONNECTED = "SET_CONNECTED";
export const SET_PLAYER = "SET_PLAYER";

export const SET_PARTYLIST = "SET_PARTYLIST";
export const LEAVE_PARTY = "LEAVE_PARTY";

export const SET_PARTY = "SET_PARTY";
export const SET_GAME = "SET_GAME";
export const SET_HAND = "SET_HAND";
export const SET_ROUND = "SET_ROUND";
export const SET_COUNTDOWN = "SET_COUNTDOWN";

export const ADD_NOTICATION = "ADD_NOTIFICATION";
export const DEL_NOTICATION = "DEL_NOTIFICATION";

export const SET_MESSAGES = "SET_MESSAGES";
export const ADD_MESSAGE = "ADD_MESSAGE";

export const GAME_FINISHED = "GAME_FINISHED";
export const KICKED = "KICKED";

export const SET_BROADCAST = "SET_BROADCAST";

export function leave_party() {
    store.dispatch({
        type: LEAVE_PARTY,
    });
}

export function set_connected(isConnected) {
    store.dispatch({
        type: SET_CONNECTED,
        isConnected: isConnected
    });
}

export function set_player(player) {
    store.dispatch({
        type: SET_PLAYER,
        player: player
    });
}

export function set_partylist(partylist) {
    store.dispatch({
        type: SET_PARTYLIST,
        partylist: partylist
    });
}

export function set_party(party) {
    store.dispatch({
        type: SET_PARTY,
        party: party
    });
}

export function set_game(game) {
    store.dispatch({
        type: SET_GAME,
        game: game
    });
}

export function set_round(round) {
    store.dispatch({
        type: SET_ROUND,
        round: round
    });
}

export function set_hand(hand) {
    store.dispatch({
        type: SET_HAND,
        hand: hand
    });
}

export function set_countdown(time) {
    store.dispatch({
        type: SET_COUNTDOWN,
        time: time
    });
}

export function add_notification(notification, deleteTime) {
    notification.id = uuid.v4();

    store.dispatch({
        type: ADD_NOTICATION,
        notification: notification
    });

    if ( deleteTime > 0 ) {
        setTimeout(function() {
            del_notification(notification.id);
        }, deleteTime);
    }
}

export function del_notification(id) {
    store.dispatch({
        type: DEL_NOTICATION,
        id: id
    });
}

export function add_message(message) {
    store.dispatch({
        type: ADD_MESSAGE,
        message: message
    });
}

export function set_messages(messages) {
    store.dispatch({
        type: SET_MESSAGES,
        messages: messages
    });
}

export function game_finished() {
    store.dispatch({
        type: GAME_FINISHED
    });
}

export function set_broadcast(text) {
    store.dispatch({
        type: SET_BROADCAST,
        text: text
    });
}

export function kicked() {
    store.dispatch({
        type: KICKED
    });
}
