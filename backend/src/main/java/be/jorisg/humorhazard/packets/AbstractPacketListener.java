package be.jorisg.humorhazard.packets;

import be.jorisg.humorhazard.Server;

public abstract class AbstractPacketListener implements PacketListener {

    protected final Server server;

    public AbstractPacketListener(Server server) {
        this.server = server;
    }

}
