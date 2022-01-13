package be.jorisg.humorhazard.packets;

public enum PacketType {
    // --- INBOUND ---

    // auth
    REGISTER, LOGIN,

    // party
    PARTY_JOIN, PARTY_QUIT, PARTY_CREATE, PARTY_INFO,

    // party owner
    PARTY_START_GAME, PARTY_CHANGE_SETTINGS, PARTY_KICK,

    // players
    GAME_PICK_CARDS,

    PARTY_CHAT_MESSAGE, // also outbound

    // --- OUTBOUND ---

    PARTYLIST,ALERT,

    // party
    PARTY_UPDATE, PARTY_PLAYERS_UPDATE, PARTY_SETTINGS_UPDATE,

    // game
    GAME_UPDATE, GAME_ROUND_UPDATE, GAME_HAND_UPDATE, GAME_PARTICIPANTS_UPDATE,

    // countdown
    ROUND_COUNTDOWN_UPDATE;
}
