package be.jorisg.humorhazard.data.card;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Created by Joris on 4/04/2020 in project HumorHazardServer.
 */
public class Deck {

    private final List<Card> cards = new ArrayList<>();

    public Deck(Collection<Card> cards) {
        this.cards.addAll(cards);
    }

    public Card take() {
        return take(null);
    }

    public Card take(CardType type) {
        int index = 0;
        while ( type != null && cards.get(index).type() != type ) {
            index++;
        }
        return cards.remove(index);
    }

    public void add(Card card) {
        if ( cards.contains(card) ) {
            return;
        }
        cards.add(card);
    }

    public void addAll(Collection<Card> cards) {
        cards.forEach(this::add);
    }

    public void shuffle() {
        Collections.shuffle(this.cards);
    }

}
