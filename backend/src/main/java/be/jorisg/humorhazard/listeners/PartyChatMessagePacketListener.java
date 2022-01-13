package be.jorisg.humorhazard.listeners;

import be.jorisg.humorhazard.Server;
import be.jorisg.humorhazard.data.party.ChatMessage;
import be.jorisg.humorhazard.data.Error;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.party.Party;
import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.packets.AbstractPacketListener;
import be.jorisg.humorhazard.packets.PacketType;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.function.BiConsumer;

public class PartyChatMessagePacketListener extends AbstractPacketListener {

    public PartyChatMessagePacketListener(Server server) {
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

        ChatMessage msg = new ChatMessage(player.name(), payload.asText());
        party.addChatMessage(msg);
        server.send(party.players(), PacketType.PARTY_CHAT_MESSAGE, msg);
    }

}
