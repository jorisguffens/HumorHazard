package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.party.PartySettings;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class PartySettingsSerializer extends StdSerializer<PartySettings> {

    public PartySettingsSerializer() {
        super(PartySettings.class);
    }

    @Override
    public void serialize(PartySettings value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeBooleanField("visible", value.isVisible());
        gen.writeNumberField("player_limit", value.playerLimit());
        gen.writeNumberField("score_limit", value.scoreLimit());
        gen.writeNumberField("timer_duration_multiplier", value.timerDurationMultiplier());
        gen.writeEndObject();
    }
}
