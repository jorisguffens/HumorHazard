package be.jorisg.humorhazard.data.game;

import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.card.CardType;
import be.jorisg.humorhazard.scheduler.SchedulerTask;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Created by Joris on 14/04/2020 in project HumorHazardServer.
 */
public class Round {

    private final int reward;
    private final boolean bonusRound;

    private final Player judge;
    private Card[] startCards;

    private RoundStatus status = RoundStatus.FILLING;
    private final Map<Player, Card[]> picks = new ConcurrentHashMap<>();
    private Player winner = null;

    private SchedulerTask timer;

    private Round(Player judge, Card startCard, boolean bonusRound) {
        this.judge = judge;
        this.startCards = new Card[] { startCard };
        this.bonusRound = bonusRound;
        this.reward = 1;

        if ( bonusRound ) {
            status = RoundStatus.PICKING;
        }
    }

    public Round(Player judge, Card startCard) {
        this(judge, startCard, startCard.type() == CardType.RED);
    }

    void removePlayer(Player player) {
        picks.remove(player);
    }

    public boolean isBonusRound() {
        return bonusRound;
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
    }

    public void cancelTimer() {
        if ( timer != null ) {
            timer.cancel();
        }
    }

    public void setTimer(SchedulerTask timer) {
        cancelTimer();
        this.timer = timer;
    }

    public enum RoundStatus {
        FILLING(40),
        PICKING(60),
        CHOOSING_WINNER(60),
        FINISHED(8);

        private final int defaultDuration;

        RoundStatus(int defaultDuration) {
            this.defaultDuration = defaultDuration;
        }

        public int defaultDuration() {
            return defaultDuration;
        }
    }

}
