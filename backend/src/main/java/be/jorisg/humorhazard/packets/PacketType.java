package be.jorisg.humorhazard.packets;

public enum PacketType {
    // INBOUND

    // auth
    REGISTER, LOGIN,

    // party
    PARTY_JOIN, PARTY_QUIT, PARTY_CREATE, PARTY_INFO,

    // party owner
    PARTY_START_GAME, PARTY_CHANGE_SETTINGS, PARTY_KICK,

    // players
    PICK_CARD, SEND_MESSAGE,

    // OUTBOUND
    PARTY_UPDATE, PARTY_UPDATE_SETTINGS, PARTY_UPDATE_GAME, PARTY_UPDATE_ROUND;
}
