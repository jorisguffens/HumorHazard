package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.Error;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class ErrorSerializer extends StdSerializer<Error> {

    public ErrorSerializer() {
        super(Error.class);
    }

    @Override
    public void serialize(Error value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeStringField("error", value.message());
        gen.writeEndObject();
    }
}
