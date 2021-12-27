package be.jorisg.humorhazard;

import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.packets.PacketListener;
import be.jorisg.humorhazard.packets.PacketType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.HashSet;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.Consumer;

public class PacketHandler {

    private final Set<RegisteredListener> listeners = new HashSet<>();

    public void register(PacketType type, PacketListener listener) {
        listeners.add(new RegisteredListener(type, listener));
    }

    private record RegisteredListener(PacketType type, PacketListener listener) {
    }

    //

    public void handle(ChannelHandler ch, JsonNode packet) {
        PacketType type;
        try {
            type = PacketType.valueOf(packet.get("type").asText());
        } catch (IllegalArgumentException ignored) {
            return;
        }

        JsonNode payload = packet.get("payload");

        BiConsumer<PacketType, Object> respond = (t, pl) -> {
            ObjectNode pt = HumorHazard.objectMapper.createObjectNode();
            pt.set("type", HumorHazard.objectMapper.valueToTree(type));

            if ( pl != null ) {
                pt.set("payload", HumorHazard.objectMapper.valueToTree(pl));
            }

            if ( packet.has("callback") ){
                pt.set("callback", packet.get("callback"));
            }

            ch.send(pt.toString());
        };

        listeners.stream().filter(rl -> rl.type().equals(type)).forEach((rl) -> handle(rl, ch, type, payload, respond));
    }

    private void handle(RegisteredListener rl, ChannelHandler ch, PacketType type, JsonNode payload,
                        BiConsumer<PacketType, Object> respond) {
        try {
            rl.listener().onReceive(ch, type, payload, respond);
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    public void handleDisconnect(ChannelHandler ch) {

    }

}
