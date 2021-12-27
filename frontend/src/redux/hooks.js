import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";

export function useDispatchLogin() {
    const dispatch = useDispatch();
    return useCallback((player) => {
        if ( player.token ) {
            sessionStorage.setItem("login_token", player.token);
        }
        dispatch({
            type: "LOGIN",
            action: (state) => {
                return {...state, player}
            }
        });
    }, [dispatch]);
}

export function useDispatchParty() {
    const dispatch = useDispatch();
    return useCallback((party) => {
        dispatch({
            type: "PARTY",
            action: (state) => {
                return {...state, party}
            }
        });
    }, [dispatch]);
}

export function useDispatchPartySettings() {
    const dispatch = useDispatch();
    return useCallback((settings) => {
        dispatch({
            type: "PARTY",
            action: (state) => {
                return {...state, party: {...state.party, settings}}
            }
        });
    }, [dispatch]);
}

export function useDispatchQuit() {
    const dispatch = useDispatch();
    return useCallback(() => {
        dispatch({
            type: "QUIT",
            action: (state) => {
                delete state['party'];
                return {...state}
            }
        });
    }, [dispatch]);
}

// -------------------

export function usePlayer() {
    return useSelector((state) => state.player);
}

export function useParty() {
    return useSelector((state) => state.party);
}

export function usePartyPlayers() {
    return useSelector((state) => state.party.players);
}

export function usePartySettings() {
    return useSelector((state) => state.party.settings);
}



