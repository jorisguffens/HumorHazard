import {useDispatch, useSelector} from "react-redux";
import {useCallback} from "react";

export function useDispatchLogout() {
    const dispatch = useDispatch();
    return useCallback(() => {
        dispatch({
            type: "LOGOUT",
            action: () => {
                return {};
            }
        });
    }, [dispatch]);
}

export function useDispatchLogin() {
    const dispatch = useDispatch();
    return useCallback((player) => {
        if ( player.token ) {
            sessionStorage.setItem("login_token", player.token);
        }
        localStorage.setItem("name", player.name);
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

export function useDispatchPartyPlayers() {
    const dispatch = useDispatch();
    return useCallback((players) => {
        dispatch({
            type: "PARTY_PLAYERS",
            action: (state) => {
                return {...state, party: {...state.party, players}}
            }
        });
    }, [dispatch]);
}

export function useDispatchPartySettings() {
    const dispatch = useDispatch();
    return useCallback((settings) => {
        dispatch({
            type: "PARTY_SETTINGS",
            action: (state) => {
                return {...state, party: {...state.party, settings}}
            }
        });
    }, [dispatch]);
}

export function useDispatchChatMessages() {
    const dispatch = useDispatch();
    return useCallback((chat_messages) => {
        dispatch({
            type: "PARTY_CHAT_MESSAGES",
            action: (state) => {
                return {...state, party: {...state.party, chat_messages}}
            }
        });
    }, [dispatch]);
}

export function useDispatchPartyGame() {
    const dispatch = useDispatch();
    return useCallback((game) => {
        dispatch({
            type: "PARTY_GAME",
            action: (state) => {
                return {...state, party: {...state.party, game}}
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

export function useDispatchGame() {
    const dispatch = useDispatch();
    return useCallback((game) => {
        dispatch({
            type: "GAME",
            action: (state) => {
                return {...state, party: {...state.party, game}}
            }
        });
    }, [dispatch]);
}

export function useDispatchGameHand() {
    const dispatch = useDispatch();
    return useCallback((hand) => {
        dispatch({
            type: "GAME_HAND",
            action: (state) => {
                return {...state, hand}
            }
        });
    }, [dispatch]);
}

export function useDispatchGameRound() {
    const dispatch = useDispatch();
    return useCallback((round) => {
        dispatch({
            type: "GAME_ROUND",
            action: (state) => {
                return {...state, party: {...state.party, game: {...state.party.game, round}}}
            }
        });
    }, [dispatch]);
}

export function useDispatchGameParticipants() {
    const dispatch = useDispatch();
    return useCallback((participants) => {
        dispatch({
            type: "GAME_PARTICIPANTS",
            action: (state) => {
                return {...state, party: {...state.party, game: {...state.party.game, participants}}}
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
    return useSelector((state) => state.party && state.party.players);
}

export function usePartySettings() {
    return useSelector((state) => state.party && state.party.settings);
}

export function usePartyChatMessages() {
    return useSelector((state) => state.party && state.party.chat_messages);
}

export function useGame() {
    return useSelector((state) => state.party && state.party.game);
}

export function useGameHand() {
    return useSelector((state) => state.hand);
}

export function useGameRound() {
    return useSelector((state) => state.party && state.party.game && state.party.game.round);
}

export function useGameParticipants() {
    return useSelector((state) => state.party && state.party.game && state.party.game.participants);
}

export function useGameSpectators() {
    return useSelector((state) => state.party && state.party.game && state.party.game.spectators);
}

export function useRoundStatus() {
    return useGameRound().status;
}
