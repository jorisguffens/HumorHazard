package be.jorisg.humorhazard.serialization;

import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.game.Round;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;
import java.util.stream.Collectors;

public class RoundSerializer extends StdSerializer<Round> {

    public RoundSerializer() {
        super(Round.class);
    }

    @Override
    public void serialize(Round value, JsonGenerator gen, SerializerProvider provider) throws IOException {
        gen.writeStartObject();
        gen.writeObjectField("judge", value.judge());
        gen.writeNumberField("reward", value.reward());
        gen.writeStringField("status", value.status().name());
        gen.writeObjectField("start_cards", value.startCards());

        if (value.status().ordinal() >= Round.RoundStatus.CHOOSING_WINNER.ordinal() ) {
            gen.writeObjectField("picked_cards", value.pickedCards());
        } else {
            gen.writeObjectField("picked_players", value.pickedPlayers().stream().map(Player::id).collect(Collectors.toSet()));
        }

        if ( value.winner() != null ) {
            gen.writeObjectField("winner", value.winner());
            gen.writeObjectField("winner_cards", value.picks().get(value.winner()));
        }

        gen.writeEndObject();
    }
}
