package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.party.Party;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class PartySerializer extends StdSerializer<Party> {

    public PartySerializer() {
        super(Party.class);
    }

    @Override
    public void serialize(Party value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("id", value.id());
        gen.writeObjectField("settings", value.settings());
        gen.writeObjectField("players", value.players());
        if ( value.game() != null ) {
            gen.writeObjectField("game", value.game());
        }
        gen.writeEndObject();
    }
}
