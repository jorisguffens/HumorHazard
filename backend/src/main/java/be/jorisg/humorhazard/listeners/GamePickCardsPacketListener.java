package be.jorisg.humorhazard.listeners;

import be.jorisg.humorhazard.Server;
import be.jorisg.humorhazard.data.Error;
import be.jorisg.humorhazard.data.Player;
import be.jorisg.humorhazard.data.card.Card;
import be.jorisg.humorhazard.data.game.Game;
import be.jorisg.humorhazard.data.game.Round;
import be.jorisg.humorhazard.data.party.Party;
import be.jorisg.humorhazard.netty.ChannelHandler;
import be.jorisg.humorhazard.packets.AbstractPacketListener;
import be.jorisg.humorhazard.packets.PacketType;
import com.fasterxml.jackson.databind.JsonNode;

import java.util.ArrayList;
import java.util.Arrays;
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
        if ( party == null ) {
            respond.accept(type, new Error("You are not in a party."));
            return;
        }

        Game game = party.game();
        if ( game == null ) {
            respond.accept(type, new Error("Your party is not in a game."));
            return;
        }

        List<Card> cards = new ArrayList<>();
        for ( JsonNode n : payload.get("cards") ) {
            Card card = server.cardById(n.asText());
            if ( card != null ) {
                cards.add(server.cardById(n.asText()));
            }
        }

        if ( cards.isEmpty() ) {
            respond.accept(type, new Error("No valid cards given."));
            return;
        }

        Round round = game.round();
        if ( round.status() == Round.RoundStatus.FILLING && round.judge() == player ) {
            pickJudge(party, cards.get(0), payload.has("before") && payload.get("before").asBoolean());
            return;
        }

        if ( round.status() == Round.RoundStatus.PICKING  && round.judge() != player
                && game.participants().containsKey(player) ) {
            pickPlayer(party, player, cards.toArray(new Card[0]));
            return;
        }

        if ( round.status() == Round.RoundStatus.CHOOSING_WINNER && round.judge() == player ) {
            pickWinner(party, cards.get(0));
            return;
        }
    }

    private void pickJudge(Party party, Card card, boolean before) {
        Round round = party.game().round();
        round.setJudgeCard(card, before);
        party.game().participants().get(round.judge()).hand().remove(card);
        round.changeStatus(Round.RoundStatus.PICKING);
        server.send(party.players(), PacketType.GAME_ROUND_UPDATE, round);
    }

    private void pickWinner(Party party, Card card) {
        Round round = party.game().round();
        outer: for ( Player player : round.picks().keySet() ) {
            for ( Card c : round.picks().get(player) ) {
                if ( c == card ) {
                    round.setWinner(player);
                    break outer;
                }
            }
        }

        round.changeStatus(Round.RoundStatus.FINISHED);
        server.send(party.players(), PacketType.GAME_ROUND_UPDATE, round);

        int seconds = 8;
        if ( party.settings().timerDurationMultiplier() > 0 ) {
            seconds *= party.settings().timerDurationMultiplier();
        }
        server.scheduler().later(() -> {
            party.game().nextRound();
            server.send(party.players(), PacketType.GAME_UPDATE, party.game());
        }, seconds, TimeUnit.SECONDS);
    }

    private void pickPlayer(Party party, Player player, Card[] cards) {
        Round round = party.game().round();
        round.setPlayerCards(player, cards);
        party.game().participants().get(player).hand().removeAll(Arrays.asList(cards));

        if ( round.pickedPlayers().size() >= party.game().participants().size() - 1 ) {
            round.changeStatus(Round.RoundStatus.CHOOSING_WINNER);
        }
        server.send(party.players(), PacketType.GAME_ROUND_UPDATE, round);
    }

}
