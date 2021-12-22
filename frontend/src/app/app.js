import React from 'react';
import {Provider} from "react-redux";

import {CssBaseline, ThemeProvider} from "@mui/material";

import store from "../redux/store";
import theme from "./theme";

import Notifications from "../components/notifications/notifications";
import Broadcast from "../components/broadcast/broadcast";
import Router from "./router";

export default function App() {

    React.useEffect(function () {
        if (process.env.REACT_APP_DEBUG) {
            window.internalDebug = true;
        }
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Broadcast/>
                <Notifications/>

                <Router/>
            </ThemeProvider>
        </Provider>
    );
}
