package be.jorisg.humorhazard.listeners;

import be.jorisg.humorhazard.Server;
import be.jorisg.humorhazard.data.Error;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.party.Party;
import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.packets.AbstractPacketListener;
import be.jorisg.humorhazard.packets.PacketType;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.function.BiConsumer;

public class JoinPacketListener extends AbstractPacketListener {

    public JoinPacketListener(Server server) {
        super(server);
    }

    @Override
    public void onReceive(ChannelHandler ch, PacketType type, JsonNode payload, BiConsumer<PacketType, Object> respond) {
        Player player = server.playerByConnection(ch);
        if (player == null) {
            respond.accept(type, new Error("Something went wrong."));
            return;
        }

        Party party = server.partyById(payload.get("party").asText());
        if ( party == null ) {
            respond.accept(type, new Error("Party does not exist."));
            return;
        }

        if ( party.players().size() >= party.settings().playerLimit() ) {
            respond.accept(type, new Error("Party is fulll"));
            return;
        }

        party.addPlayer(player);
        respond.accept(type, party);

        party.players().forEach(p -> server.send(p, PacketType.UPDATE_PARTY, party));
        party.players().forEach(p -> server.send(p, PacketType.UPDATE_GAME, party.game()));
    }

}
