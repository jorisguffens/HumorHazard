import {createStore} from "redux";
import reducers from "./reducers";

export const store = createStore(reducers, {
    isConnected: false,
    notifications: [],
    messages: []
});

export default store;