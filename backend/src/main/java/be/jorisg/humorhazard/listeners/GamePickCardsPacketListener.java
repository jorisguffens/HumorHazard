package be.jorisg.humorhazard.listeners;

import be.jorisg.humorhazard.Server;
import be.jorisg.humorhazard.data.Error;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.card.CardType;
import be.jorisg.humorhazard.data.game.Game;
import be.jorisg.humorhazard.data.game.Round;
import be.jorisg.humorhazard.data.party.Party;
import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.packets.AbstractPacketListener;
import be.jorisg.humorhazard.packets.PacketType;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.BiConsumer;

public class GamePickCardsPacketListener extends AbstractPacketListener {

    public GamePickCardsPacketListener(Server server) {
        super(server);
    }

    @Override
    public void onReceive(ChannelHandler ch, PacketType type, JsonNode payload, BiConsumer<PacketType, Object> respond) {
        Player player = server.playerByConnection(ch);
        if (player == null) {
            respond.accept(type, new Error("Something went wrong."));
            return;
        }

        Party party = server.partyByPlayer(player);
        if (party == null) {
            respond.accept(type, new Error("You are not in a party."));
            return;
        }

        Game game = party.game();
        if (game == null) {
            respond.accept(type, new Error("Your party is not in a game."));
            return;
        }

        List<Card> cards = new ArrayList<>();
        for (JsonNode n : payload.get("cards")) {
            Card card = server.cardById(n.asText());
            if (card != null) {
                cards.add(server.cardById(n.asText()));
            }
        }

        if (cards.isEmpty()) {
            respond.accept(type, new Error("No valid cards given."));
            return;
        }

        Round round = game.round();

        // judge fill card
        if (round.status() == Round.RoundStatus.FILLING ) {
            if ( round.judge() != player ) {
                respond.accept(type, new Error("You are not the judge."));
                return;
            }

            Card card = cards.get(0);
            if ( card.type() == CardType.RED ) {
                respond.accept(type, new Error("You cannot pick a red card."));
                return;
            }

            if ( !game.participants().get(player).hand().contains(card) ) {
                respond.accept(type, new Error("You don't have the given card."));
                return;
            }

            boolean before = payload.has("before") && payload.get("before").asBoolean();

            respond.accept(type, null);
            pickFill(player, party, card, before);
            return;
        }

        // players pick
        if (round.status() == Round.RoundStatus.PICKING ) {
            if ( round.judge() == player || !game.participants().containsKey(player) ) {
                respond.accept(type, new Error("You cannot pick right now."));
                return;
            }

            if ( !game.participants().get(player).hand().containsAll(cards) ) {
                respond.accept(type, new Error("You don't have the given card(s)."));
                return;
            }

            respond.accept(type, null);
            pickPlayer(player, party, cards);
            return;
        }

        // judge winner pick
        if (round.status() == Round.RoundStatus.CHOOSING_WINNER ) {
            if ( round.judge() != player ) {
                respond.accept(type, new Error("You are not the judge."));
                return;
            }

            respond.accept(type, null);
            pickWinner(party, cards.get(0));
            return;
        }
    }

    private void pickFill(Player player, Party party, Card card, boolean before) {
        Round round = party.game().round();
        round.setJudgeCard(card, before);
        party.game().participants().get(round.judge()).takeCard(card);
        round.changeStatus(Round.RoundStatus.PICKING);

        server.send(player, PacketType.GAME_HAND_UPDATE, party.game().participants().get(player).hand());
        server.send(party.players(), PacketType.GAME_ROUND_UPDATE, round);
    }

    private void pickWinner(Party party, Card card) {
        Round round = party.game().round();
        outer:
        for (Player player : round.picks().keySet()) {
            for (Card c : round.picks().get(player)) {
                if (c == card) {
                    round.setWinner(player);
                    break outer;
                }
            }
        }

        party.game().participants().get(round.winner()).increaseScore(round.reward());
        // TODO if score limit is reached

        round.changeStatus(Round.RoundStatus.FINISHED);
        server.send(party.players(), PacketType.GAME_UPDATE, party.game());

        server.scheduler().later(() -> {
            party.game().nextRound();
            server.send(party.players(), PacketType.GAME_UPDATE, party.game());

            party.game().participants().forEach((key, value) ->
                    server.send(key, PacketType.GAME_HAND_UPDATE, value.hand()));
        }, 8, TimeUnit.SECONDS);
    }

    private void pickPlayer(Player player, Party party, Collection<Card> cards) {
        Round round = party.game().round();
        round.setPlayerCards(player, cards.toArray(new Card[0]));
        party.game().participants().get(player).takeCards(cards);

        if (round.pickedPlayers().size() >= party.game().participants().size() - 1) {
            round.changeStatus(Round.RoundStatus.CHOOSING_WINNER);
        }

        server.send(player, PacketType.GAME_HAND_UPDATE, party.game().participants().get(player).hand());
        server.send(party.players(), PacketType.GAME_ROUND_UPDATE, round);
    }

}
