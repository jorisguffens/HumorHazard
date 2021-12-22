package be.jorisg.humorhazard;

import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.Card;
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
import java.util.concurrent.TimeUnit;

/**
 * Created by Joris on 3/04/2020 in project HumorHazard.
 */
public class Server {

    private static final Logger logger = LogManager.getLogger(HumorHazard.class);

    private final Scheduler scheduler = new Scheduler();

    private final String letter;
    private final List<Card> cards;

    private final Map<Player, ChannelHandler> players = new ConcurrentHashMap<>();
    private final Map<String, Party> parties = new ConcurrentHashMap<>();

    public Server(String letter, String url, String host, int port) {
        this.letter = letter;

        this.cards = CardLoader.load();

        PacketHandler packetHandler = new PacketHandler();
        packetHandler.register(PacketType.REGISTER, new RegisterPacketListener(this));
        packetHandler.register(PacketType.LOGIN, new LoginPacketListener(this));
        packetHandler.register(PacketType.CREATE, new CreatePacketListener(this));
        packetHandler.register(PacketType.JOIN, new JoinPacketListener(this));
        packetHandler.register(PacketType.QUIT, new QuitPacketListener(this));
        packetHandler.register(PacketType.CHANGE_SETTINGS, new ChangeSettingsPacketListener(this));
        packetHandler.register(PacketType.KICK, new KickPacketListener(this));
        packetHandler.register(PacketType.START_GAME, new StartGamePacketListener(this));

        NettyServer nettyServer = new NettyServer(scheduler, packetHandler, url, host, port);
        nettyServer.start();
    }

    public List<Card> cards() {
        return cards;
    }

    public Scheduler scheduler() {
        return scheduler;
    }

    public Player register(String name) {
        return new Player(UUID.randomUUID().toString(), name, RandomStringUtils.randomAlphanumeric(32));
    }

    public void connect(Player player, ChannelHandler ch) {
        Player old = playerByConnection(ch);
        if ( old != null ) {
            quit(old);
        }

        players.put(player, ch);
    }

    public void disconnect(Player player) {
        players.put(player, null);

        Party party = partyByPlayer(player);
        if (party == null) {
            quitTimer(player, 30);
            return;
        }

        if (party.game() == null) {
            quitTimer(player, 30); // party not in game
            return;
        }

        if (party.game().spectators().contains(player)) {
            quitTimer(player, 5); // spectator
            return;
        }

        // TODO update disconnected status
//        pi.disconnected = true;
//        if (party.game.round != null) {
//            party.game.round.publish();
//        }

        quitTimer(player, 30); // party ingame
    }

    public void quit(Player player) {
        Party party = partyByPlayer(player);
        if (party != null) {
            party.removePlayer(player);
            send(party.players(), PacketType.UPDATE_PARTY, party);
        }

        players.remove(player);
    }

    private void quitTimer(Player player, int seconds) {
        scheduler.later(() -> {
            if (players.get(player) != null) {
                return;
            }
            quit(player);
        }, seconds, TimeUnit.SECONDS);
    }

    public Party createParty() {
        String id;
        do {
            id = this.letter + RandomStringUtils.randomAlphanumeric(6);
        } while (partyById(id) != null);

        Party party = new Party(id);
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

    public void send(Player p, PacketType type, Object payload) {
        ChannelHandler ch = players.get(p);
        send(ch, type, payload);
    }

    public void send(Player p, PacketType type) {
        send(p, type, null);
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

}
