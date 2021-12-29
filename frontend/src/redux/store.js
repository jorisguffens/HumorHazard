import {createStore} from "redux";

export const store = createStore(
    (state, action) => {
        if (typeof action.action !== "function") return state;
        return action.action(state);
    },
    {
        isConnected: false,
        notifications: [],
        messages: []
    });

export default store;