package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.game.GamePlayer;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class GamePlayerSerializer extends StdSerializer<GamePlayer> {

    public GamePlayerSerializer() {
        super(GamePlayer.class);
    }

    @Override
    public void serialize(GamePlayer value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeNumberField("score", value.score());
        gen.writeBooleanField("disconnected", value.isDisconnected());
        gen.writeEndObject();
    }
}
