package be.jorisg.humorhazard;

import be.jorisg.humorhazard.packets.PacketType;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;
import java.util.function.Consumer;
import java.util.regex.Pattern;

public class CommandManager {

    private static final Logger logger = LogManager.getLogger(CommandManager.class);

    private final Server server;
    private final Map<String, Consumer<String[]>> commands = new HashMap<>();

    public CommandManager(Server server) {
        this.server = server;
        commands.put("stats", this::stats);
        commands.put("alert", this::alert);
    }

    public void start() {
        new Thread(this::run).start();
    }

    private void run() {
        Scanner scanner = new Scanner(System.in);
        while ( true ) {
            String input = scanner.nextLine();

            String[] args = input.split(Pattern.quote(" "));
            String cmd = args[0].toLowerCase();
            args = Arrays.copyOfRange(args, 1, args.length);

            Consumer<String[]> executor = commands.get(cmd);
            if ( executor == null ) {
                continue;
            }

            logger.info("Executing command: " + input);
            executor.accept(args);
        }
    }

    // COMMANDS

    private void stats(String[] args) {
        logger.info("Total players: " + server.players().size());
        logger.info("Players in party: " + server.parties().stream().mapToLong(p -> p.players().size()).sum());
        logger.info("Total parties: " + server.parties().size());
        logger.info("Parties in game: " + server.parties().stream().filter(p -> p.game() != null).count());
    }

    private void alert(String[] args) {
        String msg = String.join(" ", args);
        server.send(server.players(), PacketType.ALERT, msg);
        logger.info("Broadcasting '" + msg + "'");
    }

}
