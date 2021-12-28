package be.jorisg.humorhazard.data.game;

import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.card.CardType;

import java.util.*;

/**
 * Created by Joris on 14/04/2020 in project HumorHazardServer.
 */
public class Round {

    private final int reward;

    private final Player judge;
    private Card[] startCards;

    private RoundStatus status = RoundStatus.FILLING;
    private final Map<Player, Card[]> picks = new HashMap<>();
    private Player winner = null;

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

    public RoundStatus status() {
        return status;
    }

    public Card[] startCards() {
        return startCards;
    }

    public Card[][] pickedCards() {
        return picks.values().toArray(new Card[0][0]);
    }

    public Set<Player> pickedPlayers() {
        return Collections.unmodifiableSet(picks.keySet());
    }

    public Map<Player, Card[]> picks() {
        return Collections.unmodifiableMap(picks);
    }

    public void setJudgeCard(Card card, boolean before) {
        if ( before ) {
            startCards = new Card[] { card, startCards[0] };
        } else {
            startCards = new Card[] { startCards[0], card };
        }
        status = RoundStatus.PICKING;
    }

    public void setPlayerCards(Player player, Card[] cards) {
        picks.put(player, cards);

    }

    public void changeStatus(RoundStatus status) {
        this.status = status;
    }

    public Player winner() {
        return winner;
    }

    public void setWinner(Player winner) {
        this.winner = winner;
        status = RoundStatus.FINISHED;
    }

    public enum RoundStatus {
        FILLING,
        PICKING,
        CHOOSING_WINNER,
        FINISHED
    }

}
