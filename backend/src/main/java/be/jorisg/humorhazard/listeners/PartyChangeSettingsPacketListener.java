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

public class PartyChangeSettingsPacketListener extends AbstractPacketListener {

    public PartyChangeSettingsPacketListener(Server server) {
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

        if ( party.game() != null ) {
            respond.accept(type, new Error("Game already started."));
            return;
        }

        if ( payload.has("player_limit") ) {
            int current = party.settings().playerLimit();
            int limit = payload.get("player_limit").asInt();
            if ( limit >= 3 && limit <= 10 && limit >= party.players().size() ) {
                party.settings().setPlayerLimit(payload.get("player_limit").asInt());
            }

            if ( current != limit && party.settings().isVisible() ) {
                server.sendPartyList();
            }
        }

        if ( payload.has("score_limit")  ) {
            int limit = payload.get("score_limit").asInt();
            if ( limit >= 3 && limit <= 16 ) {
                party.settings().setScoreLimit(limit);
            }
        }

        if ( payload.has("timer_duration_multiplier")  ) {
            int multiplier = payload.get("timer_duration_multiplier").asInt();
            if ( multiplier >= 0 && multiplier <= 8 ) {
                party.settings().setTimerDurationMultiplier(multiplier);
            }
        }

        if ( payload.has("visible") ) {
            boolean visible = payload.get("visible").asBoolean();
            boolean previous = party.settings().isVisible();
            party.settings().setVisible(visible);

            if ( visible && !previous ) {
                server.sendPartyList();
            }
        }

        server.send(party.players(), PacketType.PARTY_SETTINGS_UPDATE, party.settings());
    }

}
