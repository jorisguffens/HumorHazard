
function main(state, action) {
    if ( typeof action.action !== "function" ) return state;
    return action.action(state);

    //
    // if ( action.type === SET_CONNECTED ) {
    //     return Object.assign({}, state, {
    //         isConnected: action.isConnected
    //     });
    // }
    //
    // if ( action.type === LEAVE_PARTY ) {
    //     return Object.assign({}, state, {
    //         player: null,
    //         party: null,
    //         game: null,
    //         round: null,
    //         hand: null,
    //         countdown: null,
    //         messages: null
    //     });
    // }
    //
    // if ( action.type === SET_PLAYER ) {
    //     return Object.assign({}, state, {
    //         player: action.player
    //     });
    // }
    //
    // if ( action.type === SET_PARTYLIST ) {
    //     return Object.assign({}, state, {
    //         partylist: action.partylist
    //     });
    // }
    //
    // if ( action.type === SET_PARTY ) {
    //     return Object.assign({}, state, {
    //         party: action.party
    //     });
    // }
    //
    // if ( action.type === SET_GAME ) {
    //     return Object.assign({}, state, {
    //         game: action.game
    //     });
    // }
    //
    // if ( action.type === SET_ROUND ) {
    //     return Object.assign({}, state, {
    //         round: action.round
    //     });
    // }
    //
    // if ( action.type === SET_HAND ) {
    //     return Object.assign({}, state, {
    //         hand: action.hand
    //     });
    // }
    //
    // if ( action.type === SET_COUNTDOWN ) {
    //     return Object.assign({}, state, {
    //         countdown: action.time
    //     });
    // }
    //
    // if ( action.type === ADD_NOTICATION) {
    //     let notifications = state.notifications.slice();
    //     notifications.push(action.notification);
    //     return Object.assign({}, state, {
    //         notifications: notifications
    //     });
    // }
    //
    // if ( action.type === DEL_NOTICATION) {
    //     let notifications = state.notifications.slice();
    //
    //     for ( let i = 0; i < notifications.length; i++ ) {
    //         if ( notifications[i].id === action.id ) {
    //             notifications.splice(i, 1);
    //             break;
    //         }
    //     }
    //
    //     return Object.assign({}, state, {
    //         notifications: notifications
    //     });
    // }
    //
    // if ( action.type === SET_MESSAGES) {
    //     return Object.assign({}, state, {
    //         messages: action.messages
    //     });
    // }
    //
    // if ( action.type === ADD_MESSAGE) {
    //     let messages = state.messages.slice();
    //     messages.push(action.message);
    //     return Object.assign({}, state, {
    //         messages: messages
    //     });
    // }
    //
    // if ( action.type === GAME_FINISHED ) {
    //     const newState = Object.assign({}, state);
    //
    //     delete newState.game;
    //     delete newState.round;
    //     delete newState.hand;
    //     delete newState.countdown;
    //
    //     return newState;
    // }
    //
    // if ( action.type === KICKED ) {
    //     const newState = Object.assign({}, state);
    //
    //     delete newState.game;
    //     delete newState.round;
    //     delete newState.hand;
    //     delete newState.countdown;
    //     delete newState.party;
    //     delete newState.player;
    //     return newState;
    // }
    //
    // if ( action.type === SET_BROADCAST ) {
    //     return Object.assign({}, state, {
    //         broadcast: action.text
    //     });
    // }

    return state;
}

export default function combined(state, action) {
    return main(state, action);
}