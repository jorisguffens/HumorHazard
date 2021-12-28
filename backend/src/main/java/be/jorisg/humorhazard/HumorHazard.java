package be.jorisg.humorhazard;

import be.jorisg.humorhazard.data.Error;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.game.Game;
import be.jorisg.humorhazard.data.game.GamePlayer;
import be.jorisg.humorhazard.data.game.Round;
import be.jorisg.humorhazard.data.party.Party;
import be.jorisg.humorhazard.data.party.PartySettings;
import be.jorisg.humorhazard.serialization.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * Created by Joris on 3/04/2020 in project HumorHazard.
 */
public class HumorHazard {

    private static final Logger logger = LogManager.getLogger(HumorHazard.class);

    public static final ObjectMapper objectMapper = new ObjectMapper();

    public static void main(String[] args) {
        String host = "0.0.0.0";

        int port = 80;
        if (System.getenv().containsKey("PORT")) {
            port = Integer.parseInt(System.getenv("PORT"));
        }

        String letter = System.getenv("LETTER_PREFIX");
        String url = System.getenv("WEBSOCKET_URL");


        SimpleModule module = new SimpleModule("Serializers");
        module.addSerializer(Player.class, new PlayerSerializer());
        module.addSerializer(Party.class, new PartySerializer());
        module.addSerializer(PartySettings.class, new PartySettingsSerializer());
        module.addSerializer(Card.class, new CardSerializer());
        module.addSerializer(Game.class, new GameSerializer());
        module.addSerializer(Round.class, new RoundSerializer());
        module.addSerializer(Error.class, new ErrorSerializer());
        module.addSerializer(GamePlayer.class, new GamePlayerSerializer());

        objectMapper.registerModule(module);

        Server server = new Server(letter, url, host, port);
    }

}
