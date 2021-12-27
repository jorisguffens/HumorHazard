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
    PICK_CARD, SEND_MESSAGE,

    // --- OUTBOUND ---

    // party
    PARTY_UPDATE, PARTY_UPDATE_SETTINGS,

    // game
    GAME_UPDATE, GAME_ROUND_UPDATE, GAME_HAND_UPDATE;
}
