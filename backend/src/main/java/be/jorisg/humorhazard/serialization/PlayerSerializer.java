package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.Player;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class PlayerSerializer extends StdSerializer<Player> {

    public PlayerSerializer() {
        super(Player.class);
    }

    @Override
    public void serialize(Player value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("id", value.id());
        gen.writeStringField("name", value.name());
        gen.writeEndObject();
    }
}
