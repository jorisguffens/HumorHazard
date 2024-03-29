package be.jorisg.humorhazard.listeners;

import be.jorisg.humorhazard.Server;
import be.jorisg.humorhazard.data.Error;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.game.GamePlayer;
import be.jorisg.humorhazard.data.party.Party;
import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.packets.AbstractPacketListener;
import be.jorisg.humorhazard.packets.PacketType;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.function.BiConsumer;

public class PartyJoinPacketListener extends AbstractPacketListener {

    public PartyJoinPacketListener(Server server) {
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
            party = server.createParty(payload.get("party").asText());
        }

        if ( party.players().contains(player) ) {
            respond.accept(type, party);
            update(player, party);
            return;
        }

        if ( party.players().size() >= party.settings().playerLimit() ) {
            respond.accept(type, new Error("Party is fulll"));
            return;
        }

        Party old = server.partyByPlayer(player);
        if ( old != null ) {
            server.quitParty(player);
        }

        party.addPlayer(player);
        respond.accept(type, party);

        server.send(party.players(), PacketType.PARTY_PLAYERS_UPDATE, party.players());

        if ( party.settings().isVisible() ) {
            server.sendPartyList();
        }

        update(player, party);
    }

    private void update(Player player, Party party) {
        if ( party.game() == null  ) {
            return;
        }

        GamePlayer gp = party.game().participants().get(player);
        if ( gp == null ) {
            return;
        }

        server.send(player, PacketType.GAME_HAND_UPDATE, gp.hand());
    }

}
