package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.card.Card;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class CardSerializer extends StdSerializer<Card> {

    public CardSerializer() {
        super(Card.class);
    }

    @Override
    public void serialize(Card value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("id", value.id());
        gen.writeObjectField("type", value.type());
        gen.writeObjectField("image", value.image());
        gen.writeEndObject();
    }
}
