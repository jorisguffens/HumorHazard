import React from 'react';
import {Provider} from "react-redux";

import {ThemeProvider} from "@mui/material";
import {PacketHandlerProvider} from "../socket/packetHandler";

import store from "../redux/store";
import theme from "./theme";
import Handler from "./handler";

export default function App() {

    React.useEffect(function () {
        if (process.env.REACT_APP_DEBUG) {
            window.internalDebug = true;
        }
    }, []);

    return (
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <PacketHandlerProvider>
                    <Handler/>
                </PacketHandlerProvider>
            </ThemeProvider>
        </Provider>
    )
}

