import {BrowserRouter, Route, Routes} from "react-router-dom";

import Landing from "../routes/landing/landing";
import Party from "../routes/party/party";

export default function Router() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:party" element={<Party/>} />
                <Route path="/" element={<Landing/>} />
            </Routes>
        </BrowserRouter>
    )
}