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

public class KickPacketListener extends AbstractPacketListener {

    public KickPacketListener(Server server) {
        super(server);
    }

    @Override
    public void onReceive(ChannelHandler ch, PacketType type, JsonNode payload, BiConsumer<PacketType, Object> respond) {
        Player player = server.playerByConnection(ch);
        if (player == null) {
            respond.accept(type, new Error("Something went wrong."));
            return;
        }

        Party party = server.partyByPlayer(player);
        if ( party == null ) {
            respond.accept(type, new Error("You are not in a party."));
            return;
        }

        if ( !party.leader().equals(player) ) {
            respond.accept(type, new Error("You are not the party leader."));
            return;
        }

        if ( !payload.has("player_id") ) {
            respond.accept(type, new Error("No player given."));
            return;
        }

        Player target = server.playerById(payload.get("player_id").asText());
        if ( target == null || server.partyByPlayer(target) != party ) {
            respond.accept(type, new Error("That player is not in your party."));
            return;
        }

        party.removePlayer(target);
        server.send(target, PacketType.KICK);
        server.send(party.players(), PacketType.UPDATE_PARTY, party);
    }

}
