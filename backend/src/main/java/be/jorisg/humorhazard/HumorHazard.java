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
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;

/**
 * Created by Joris on 3/04/2020 in project HumorHazard.
 */
public class HumorHazard {

    private static final Logger logger = LogManager.getLogger(HumorHazard.class);

    public static final ObjectMapper objectMapper = new ObjectMapper();

    public static void main(String[] args) {

        if (args.length == 0) {
            logger.error("Invalid amount of arguments. Shutting down.");
            return;
        }

        File settingsFile = new File(args[0]);
        if (!settingsFile.exists()) {
            logger.error("Settings file not found. Shutting down.");
            return;
        }

        JsonNode settings;
        try (FileReader reader = new FileReader(settingsFile)) {
            settings = objectMapper.readTree(reader);
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        if (!settings.has("host") || !settings.has("port")) {
            logger.error("Settings file does not contain host and port.");
            return;
        }

        if (!settings.has("letter")) {
            logger.error("Settings file does not contain letter");
            return;
        }

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

        Server server = new Server(
                settings.get("letter").asText(),
                settings.get("url").asText(),
                settings.get("host").asText(),
                settings.get("port").asInt()
        );
    }

}
