package be.jorisg.humorhazard.packets;

public enum PacketType {
    // INBOUND

    // auth
    REGISTER, LOGIN,

    // party
    JOIN,QUIT,CREATE,

    // party owner
    START_GAME, CHANGE_SETTINGS, KICK,

    // players
    PICK_CARD, SEND_MESSAGE,

    // OUTBOUND
    UPDATE_PARTY, UPDATE_GAME, UPDATE_ROUND;
}
