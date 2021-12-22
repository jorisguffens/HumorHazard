package be.jorisg.humorhazard.util;

import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.card.CardType;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Joris on 3/04/2020 in project HumorHazardServer.
 */
public class CardLoader {

    public static List<Card> load() {
        URL url = CardLoader.class.getClassLoader().getResource("cards.csv");
        if ( url == null ) {
            throw new IllegalStateException("cards.csv was not found in the classpath");
        }

        List<Card> cards = new ArrayList<>();
        try (
                InputStream inputStream = url.openStream();
                InputStreamReader streamReader = new InputStreamReader(inputStream, StandardCharsets.UTF_8);
                BufferedReader br = new BufferedReader(streamReader)
        ) {
            String line;
            while ((line = br.readLine()) != null) {
                String[] info = line.split("\t");

                CardType type = Boolean.parseBoolean(info[2]) ? CardType.RED : CardType.BLACK;
                cards.add(new Card(info[0], info[1], type));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return cards;
    }

}
