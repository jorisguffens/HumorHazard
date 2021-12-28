package be.jorisg.humorhazard;

import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.game.Game;
import be.jorisg.humorhazard.data.game.Round;
import be.jorisg.humorhazard.data.party.Party;
import be.jorisg.humorhazard.listeners.*;
import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.netty.NettyServer;
import be.jorisg.humorhazard.packets.PacketType;
import be.jorisg.humorhazard.scheduler.Scheduler;
import be.jorisg.humorhazard.util.CardLoader;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * Created by Joris on 3/04/2020 in project HumorHazard.
 */
public class Server {

    private static final Logger logger = LogManager.getLogger(HumorHazard.class);
    private static final Random random = new Random();

    private final Scheduler scheduler = new Scheduler();

    private final String letter;
    private final Map<String, Card> cards = new HashMap<>();

    private final Map<Player, ChannelHandler> players = new ConcurrentHashMap<>();
    private final Set<Player> reconnectingPlayers = new CopyOnWriteArraySet<>();

    private final Map<String, Party> parties = new ConcurrentHashMap<>();

    public Server(String letter, String url, String host, int port) {
        this.letter = letter;

        for (Card card : CardLoader.load()) {
            cards.put(card.id(), card);
        }

        PacketHandler packetHandler = new PacketHandler();
        packetHandler.registerPacketListener(PacketType.REGISTER, new RegisterPacketListener(this));
        packetHandler.registerPacketListener(PacketType.LOGIN, new LoginPacketListener(this));
        packetHandler.registerPacketListener(PacketType.PARTY_CREATE, new PartyCreatePacketListener(this));
        packetHandler.registerPacketListener(PacketType.PARTY_JOIN, new PartyJoinPacketListener(this));
        packetHandler.registerPacketListener(PacketType.PARTY_QUIT, new PartyQuitPacketListener(this));
        packetHandler.registerPacketListener(PacketType.PARTY_CHANGE_SETTINGS, new PartyChangeSettingsPacketListener(this));
        packetHandler.registerPacketListener(PacketType.PARTY_KICK, new PartyKickPacketListener(this));
        packetHandler.registerPacketListener(PacketType.PARTY_START_GAME, new PartyStartGamePacketListener(this));
        packetHandler.registerPacketListener(PacketType.PARTY_INFO, new PartyInfoPacketListener(this));
        packetHandler.registerPacketListener(PacketType.GAME_PICK_CARDS, new GamePickCardsPacketListener(this));

        packetHandler.registerDisconnectListener(this::disconnect);

        NettyServer nettyServer = new NettyServer(scheduler, packetHandler, url, host, port);
        nettyServer.start();
    }

    public Collection<Card> cards() {
        return Collections.unmodifiableCollection(cards.values());
    }

    public Card cardById(String id) {
        return cards.get(id);
    }

    public Scheduler scheduler() {
        return scheduler;
    }

    public Set<Player> reconnectingPlayers() {
        return Collections.unmodifiableSet(reconnectingPlayers);
    }

    public Player register(String name) {
        return new Player(UUID.randomUUID().toString(), name, RandomStringUtils.randomAlphanumeric(32));
    }

    public void connect(Player player, ChannelHandler ch) {
        players.put(player, ch);
        reconnectingPlayers.remove(player);

        Party party = partyByPlayer(player);
        if ( party == null || party.game() == null || !party.game().participants().containsKey(player)) {
            return;
        }

        party.game().participants().get(player).setDisconnected(false);
        send(party.players(), PacketType.PARTY_UPDATE, party);
    }

    public void disconnect(ChannelHandler ch) {
        Player player = playerByConnection(ch);
        if ( player == null ) {
            return;
        }

        players.remove(player);
        reconnectingPlayers.add(player);

        Party party = partyByPlayer(player);
        if (party == null) {
            quitTimer(player, 5); // just logged in
            return;
        }

        if (party.game() == null) {
            quitTimer(player, 5); // party not in game
            return;
        }

        if (party.game().spectators().contains(player)) {
            quitTimer(player, 5); // spectator
            return;
        }

        party.game().participants().get(player).setDisconnected(true);
        send(party.players(), PacketType.PARTY_UPDATE, party);

        quitTimer(player, 30); // party ingame
    }

    public void quitParty(Player player) {
        Party party = partyByPlayer(player);
        if (party != null) {
            party.removePlayer(player);
            send(party.players(), PacketType.PARTY_UPDATE, party);
        }

        send(player, PacketType.PARTY_UPDATE, null);
    }

    public void quit(Player player) {
        quitParty(player);
        players.remove(player);
        reconnectingPlayers.remove(player);
    }

    private void quitTimer(Player player, int seconds) {
        scheduler.later(() -> {
            if (players.containsKey(player)) {
                return;
            }
            quit(player);
        }, seconds, TimeUnit.SECONDS);
    }

    public Party createParty() {
        String id;
        do {
            id = this.letter + RandomStringUtils.randomAlphanumeric(6).toUpperCase();
        } while (partyById(id) != null);
        return createParty(id);
    }

    public Party createParty(String id) {
        if (partyById(id) != null) {
            throw new IllegalArgumentException("A party with that id already exists!");
        }

        Party party = new Party(id, cards());
        parties.put(id, party);
        return party;
    }

    public void removeParty(Party party) {
        parties.remove(party.id());
    }

    public Player playerById(String id) {
        return players.keySet().stream()
                .filter(player -> player.id().equals(id))
                .findFirst().orElse(null);
    }

    public Player playerByConnection(ChannelHandler handler) {
        return players.entrySet().stream()
                .filter(entry -> entry.getValue() == handler)
                .map(Map.Entry::getKey).
                findFirst().orElse(null);
    }

    public Set<Player> players() {
        return Collections.unmodifiableSet(players.keySet());
    }

    public Party partyById(String id) {
        return parties.get(id);
    }

    public Party partyByPlayer(Player player) {
        return parties.values().stream()
                .filter(party -> party.players().contains(player))
                .findFirst().orElse(null);
    }

    public Collection<Party> parties() {
        return Collections.unmodifiableCollection(parties.values());
    }

    public void send(Collection<Player> players, PacketType type, Object payload) {
        players.forEach(p -> send(p, type, payload));
    }

    public void send(Player p, PacketType type) {
        send(p, type, null);
    }

    public void send(Player p, PacketType type, Object payload) {
        ChannelHandler ch = players.get(p);
        if ( ch != null ) {
            send(ch, type, payload);
        }
    }

    public void send(ChannelHandler ch, PacketType type, Object payload) {
        ObjectNode packet = HumorHazard.objectMapper.createObjectNode();
        packet.set("type", HumorHazard.objectMapper.valueToTree(type));
        if (payload != null) {
            packet.set("payload", HumorHazard.objectMapper.valueToTree(payload));
        }
        ch.send(packet.toString());
    }

    public void send(ChannelHandler ch, PacketType type) {
        send(ch, type, null);
    }

    // --- TIMERS ---

    public void startRoundTimer(Party party) {
        if (party.game() == null)
            throw new IllegalArgumentException("There is no game in progress for the given party.");

        Round round = party.game().round();
        if (round == null)
            throw new IllegalArgumentException("No round has started for the given game");

        if (round.timer() != null) {
            round.timer().cancel();
        }

        int duration;
        if ( round.status() == Round.RoundStatus.FINISHED ) {
            duration = round.status().defaultDuration();
        }
        else if (party.settings().timerDurationMultiplier() == 0) {
            return; // no timer
        }
        else {
            duration = round.status().defaultDuration() * party.settings().timerDurationMultiplier();
        }

        round.setTimer(scheduler.repeat(new Runnable() {
            private int count = duration;

            @Override
            public void run() {
                if (count < 0) {
                    advanceRound(party);
                    return;
                }

                send(players(), PacketType.ROUND_COUNTDOWN_UPDATE, count);
                count--;
            }
        }, 1, TimeUnit.SECONDS));
    }

    public void advanceRound(Party party) {
        if (party.game() == null)
            throw new IllegalArgumentException("There is no game in progress for the given party.");

        Game game = party.game();

        Round round = party.game().round();
        if (round == null)
            throw new IllegalArgumentException("No round has started for the given game");

        if (round.timer() != null) {
            round.timer().cancel();
        }

        if (round.status() == Round.RoundStatus.FILLING) {
            if (!round.isBonusRound() && round.startCards().length == 1) {
                game.participants().get(round.judge()).increaseAfkCount();
                game.nextRound();
            } else {
                round.changeStatus(Round.RoundStatus.PICKING);
            }
        } else if (round.status() == Round.RoundStatus.PICKING) {
            game.participants().entrySet().stream().filter(e -> !round.picks().containsKey(e.getKey()))
                    .forEach(e -> e.getValue().increaseAfkCount());

            if (round.picks().isEmpty()) {
                game.nextRound();
            }
            else if ( round.picks().size() == 1 ) {
                round.setWinner(round.picks().keySet().stream().findFirst().orElse(null));
                round.changeStatus(Round.RoundStatus.FINISHED);
            } else {
                round.changeStatus(Round.RoundStatus.CHOOSING_WINNER);
            }
        } else if (round.status() == Round.RoundStatus.CHOOSING_WINNER) {
            if (round.winner() == null) {
                game.participants().get(round.judge()).increaseAfkCount();
                game.nextRound();
            } else {
                round.changeStatus(Round.RoundStatus.FINISHED);
            }
        } else if (round.status() == Round.RoundStatus.FINISHED) {
            if (game.participants().values().stream().anyMatch(gp -> gp.score() >= party.settings().scoreLimit())) {
                party.finish();
                send(party.players(), PacketType.PARTY_UPDATE, party);
                return;
            }

            game.nextRound();
        }

        // remove afk players
        Set<Player> afkPlayers = game.participants().entrySet().stream()
                .filter(e -> e.getValue().afkCount() >= 2)
                .map(Map.Entry::getKey)
                .collect(Collectors.toSet());
        afkPlayers.forEach(this::quitParty);

        // stop game if there are not enough players
        if (party.players().size() < 3) {
            party.finish();
            send(party.players(), PacketType.PARTY_UPDATE, party);
            return;
        }

        send(party.players(), PacketType.GAME_UPDATE, party.game());
        party.game().participants().forEach((key, value) ->
                send(key, PacketType.GAME_HAND_UPDATE, value.hand()));

        startRoundTimer(party);
    }

}
