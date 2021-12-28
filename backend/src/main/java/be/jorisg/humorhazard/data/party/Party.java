package be.jorisg.humorhazard.data.party;

import be.jorisg.humorhazard.Server;
import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.card.Deck;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.game.Game;
import be.jorisg.humorhazard.data.game.Round;
import be.jorisg.humorhazard.packets.PacketType;
import be.jorisg.humorhazard.scheduler.Scheduler;
import be.jorisg.humorhazard.util.CardLoader;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * Created by Joris on 3/04/2020 in project HumorHazardServer.
 */
public class Party {

    private final String id;
    private final PartySettings settings = new PartySettings();

    private final List<Player> players = new ArrayList<>();

    private Game game = null;
    private Player winner;

    private final Deck deck;

    public Party(String id, Collection<Card> cards) {
        this.id = id;
        this.deck = new Deck(cards);
        this.deck.shuffle();
    }

    public String id() {
        return id;
    }

    public PartySettings settings() {
        return settings;
    }

    public Deck deck() {
        return deck;
    }

    public Player leader() {
        return players.get(0);
    }

    public List<Player> players() {
        return Collections.unmodifiableList(players);
    }

    public void addPlayer(Player player) {
        if ( players.contains(player) ) {
            return;
        }

        players.add(player);

        if ( game != null ) {
            game.addSpectator(player);
        }
    }

    public void removePlayer(Player player) {
        players.remove(player);

        if ( game != null ) {
            game.removePlayer(player);
        }
    }

    public Game game() {
        return game;
    }

    public Player winner() {
        return winner;
    }

    public void start() {
        if ( game != null ) {
            throw new IllegalStateException("A game already started for this party.");
        }

        this.winner = null;

        this.game = new Game(deck);
        players.forEach(p -> game.addSpectator(p));

        this.game.nextRound();
    }

    public void finish() {
        if ( game == null ) {
            throw new IllegalStateException("There is no game in progress.");
        }

        if ( game.round() != null && game.round().timer() != null ) {
            game.round().timer().cancel();
        }

        this.winner = game.participants().entrySet().stream()
                .max(Comparator.comparingInt(e -> e.getValue().score()))
                .map(Map.Entry::getKey).orElse(null);

        this.game = null;
    }

}
