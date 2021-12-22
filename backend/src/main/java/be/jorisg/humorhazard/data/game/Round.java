package be.jorisg.humorhazard.data.game;

import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.card.CardType;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by Joris on 14/04/2020 in project HumorHazardServer.
 */
public class Round {

    private final int reward;

    private final Player judge;
    private Card[] startCards;

    public Map<Player, Card[]> picks = new HashMap<>();

    public Round(Player judge, Card startCard) {
        this.judge = judge;
        this.startCards = new Card[] { startCard };
        this.reward = startCard.type() == CardType.RED ? 2 : 1;
    }

    public int reward() {
        return reward;
    }

    public Player judge() {
        return judge;
    }

    public Card[] startCards() {
        return startCards;
    }

    public Card[][] pickedCards() {
        return picks.values().toArray(new Card[0][0]);
    }

    public void setJudgeCard(Card card, boolean before) {
        if ( before ) {
            startCards = new Card[] { card, startCards[0] };
        } else {
            startCards = new Card[] { startCards[0], card };
        }
    }

    public void setPlayerCards(Player player, Card[] cards) {
        picks.put(player, cards);
    }

}
