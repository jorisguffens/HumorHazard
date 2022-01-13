package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.party.ChatMessage;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class ChatMessageSerializer extends StdSerializer<ChatMessage> {

    public ChatMessageSerializer() {
        super(ChatMessage.class);
    }

    @Override
    public void serialize(ChatMessage value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("sender", value.sender());
        gen.writeObjectField("message", value.message());
        gen.writeEndObject();
    }
}
