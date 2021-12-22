package be.jorisg.humorhazard.packets;

import be.jorisg.humorhazard.netty.ChannelHandler;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.function.BiConsumer;

public interface PacketListener {

    void onReceive(ChannelHandler ch, PacketType type, JsonNode payload, BiConsumer<PacketType, Object> respond);

}
