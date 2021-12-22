package be.jorisg.humorhazard.listeners;

import be.jorisg.humorhazard.HumorHazard;
import be.jorisg.humorhazard.Server;
import be.jorisg.humorhazard.data.Error;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.packets.AbstractPacketListener;
import be.jorisg.humorhazard.packets.PacketType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.function.BiConsumer;

public class RegisterPacketListener extends AbstractPacketListener {

    public RegisterPacketListener(Server server) {
        super(server);
    }

    @Override
    public void onReceive(ChannelHandler ch, PacketType type, JsonNode payload, BiConsumer<PacketType, Object> respond) {
        if ( payload == null || !payload.has("name") ) {
            respond.accept(type, new Error("Invalid name."));
            return;
        }

        String name = payload.get("name").asText();
        if ( name.length() <= 0 ) {
            respond.accept(type, new Error("Invalid name."));
            return;
        }

        if ( name.length() > 16 ) {
            respond.accept(type, new Error("Please choose a shorter name of less than 16 characters."));
            return;
        }

        Player player = server.register(name);
        if ( player == null ) {
            respond.accept(type, new Error("Something went wrong. Registration failed."));
            return;
        }

        server.connect(player, ch);

        ObjectNode responsePayload = HumorHazard.objectMapper.valueToTree(player);
        responsePayload.put("token", player.token());
        respond.accept(type, responsePayload);
    }

}
