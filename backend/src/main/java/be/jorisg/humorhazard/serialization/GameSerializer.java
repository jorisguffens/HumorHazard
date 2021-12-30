package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.game.Game;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class GameSerializer extends StdSerializer<Game> {

    public GameSerializer() {
        super(Game.class);
    }

    @Override
    public void serialize(Game value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeNumberField("round_number", value.roundNumber());
        gen.writeObjectField("round", value.round());
        gen.writeObjectField("spectators", value.spectators());
        gen.writeObjectField("participants", value.gamePlayers());
        gen.writeEndObject();
    }
}
