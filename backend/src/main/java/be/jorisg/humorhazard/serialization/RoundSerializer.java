package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.game.Round;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class RoundSerializer extends StdSerializer<Round> {

    public RoundSerializer() {
        super(Round.class);
    }

    @Override
    public void serialize(Round value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeObjectField("judge", value.judge());
        gen.writeNumberField("reward", value.reward());
        gen.writeObjectField("start_cards", value.startCards());
        gen.writeObjectField("picked_cards", value.pickedCards());
        gen.writeEndObject();
    }
}
