package be.jorisg.humorhazard.data.game;

import be.jorisg.humorhazard.data.card.Card;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

/**
 * Created by Joris on 4/04/2020 in project HumorHazardServer.
 */
public class GamePlayer {

    private final List<Card> hand = new ArrayList<>();

    private int score = 0;

    private boolean disconnected = false;
    private int afkCount = 0;

    public List<Card> hand() {
        return Collections.unmodifiableList(hand);
    }

    public void giveCard(Card card) {
        hand.add(card);
    }

    public void takeCard(Card card) {
        hand.remove(card);
    }

    public void takeCards(Collection<Card> cards) {
        hand.removeAll(cards);
    }

    public int score() {
        return score;
    }

    public void increaseScore(int amount) {
        score += amount;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public boolean isDisconnected() {
        return disconnected;
    }

    public void setDisconnected(boolean disconnected) {
        this.disconnected = disconnected;
    }

    public int afkCount() {
        return afkCount;
    }

    public void increaseAfkCount() {
        afkCount++;
    }

    public void resetAfkCount() {
        this.afkCount = 0;
    }

}
