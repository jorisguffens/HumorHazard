package be.jorisg.humorhazard.data.game;

import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.CardType;
import be.jorisg.humorhazard.data.card.Deck;

import java.util.*;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.stream.Collectors;

public class Game {

    private int roundNumber = -1;
    private Round round;

    private final Set<Player> pastJudges = new HashSet<>();

    private final Set<Player> spectators = new CopyOnWriteArraySet<>();
    private final Map<Player, GamePlayer> participants = Collections.synchronizedMap(new LinkedHashMap<>());

    private final Deck deck;

    public Game(Deck deck) {
        this.deck = deck;
    }

    public Deck deck() {
        return deck;
    }

    public int roundNumber() {
        return roundNumber;
    }

    public Round round() {
        return round;
    }

    public Set<Player> spectators() {
        return Collections.unmodifiableSet(spectators);
    }

    public Map<Player, GamePlayer> participants() {
        return Collections.unmodifiableMap(participants);
    }

    public Map<String, GamePlayer> gamePlayers() {
        return participants.entrySet().stream()
                .collect(Collectors.toMap(
                        (e) -> e.getKey().id(),
                        Map.Entry::getValue
                ));
    }

    public void removePlayer(Player player) {
        pastJudges.remove(player);
        participants.remove(player);
        spectators.remove(player);

        if (round != null) {
            round.removePlayer(player);
        }
    }

    public void addSpectator(Player player) {
        spectators.add(player);
    }

    private void giveCard(GamePlayer gp) {
        // make sure the player doesn't have more than 3 red cards
        int redcards = (int) gp.hand().stream().filter(c -> c.type() == CardType.RED).count();

        if (redcards >= 3) {
            gp.giveCard(deck.take(CardType.BLACK));
            return;
        }

        gp.giveCard(deck.take());
    }

    public void nextRound() {
        cancelTimer();

        // convert spectators to participants
        for (Player player : spectators) {
            GamePlayer gp = new GamePlayer();
            for (int i = 0; i < 7; i++) {
                giveCard(gp);
            }

            participants.put(player, gp);
        }
        spectators.clear();

        // give everyone new cards
        for (Player p : participants.keySet()) {
            GamePlayer gp = participants.get(p);
            while (gp.hand().size() < 7) {
                giveCard(gp);
            }
        }

        // next judge
        Player judge = participants.keySet().stream().filter(p -> !pastJudges.contains(p)).findFirst().orElse(null);
        if (judge == null) {
            pastJudges.clear();
            judge = participants.keySet().stream().findFirst().orElse(null);
        }
        pastJudges.add(judge);

        // create round
        this.round = new Round(judge, deck.take());
        roundNumber++;
    }

    public void cancelTimer() {
        if (round != null ) {
            round.cancelTimer();
        }
    }

}
