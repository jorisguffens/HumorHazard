package be.jorisg.humorhazard.listeners;

import be.jorisg.humorhazard.Server;
import be.jorisg.humorhazard.data.Error;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.party.Party;
import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.packets.AbstractPacketListener;
import be.jorisg.humorhazard.packets.PacketType;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.function.BiConsumer;

public class LoginPacketListener extends AbstractPacketListener {

    private static final Logger logger = LogManager.getLogger(LoginPacketListener.class);

    public LoginPacketListener(Server server) {
        super(server);
    }

    @Override
    public void onReceive(ChannelHandler ch, PacketType type, JsonNode payload, BiConsumer<PacketType, Object> respond) {
        if ( payload == null || !payload.has("token") ) {
            respond.accept(type, new Error("Invalid token."));
            return;
        }

        Player player = server.playerByConnection(ch);
        String token = payload.get("token").asText();

        if ( player != null && !player.token().equals(token)) {
            logger.warn("Player tried to login but there was already a connection.");
            return;
        }

        player = server.players().stream().filter(p -> p.token().equals(token)).findFirst().orElse(null);
        if ( player == null ) {
            respond.accept(type, new Error("Login failed."));
            return;
        }

        server.connect(player, ch);
        respond.accept(type, player);

        Party party = server.partyByPlayer(player);
        if ( party != null ) {
            server.send(player, PacketType.UPDATE_PARTY, party);
        }
    }

}
