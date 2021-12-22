package be.jorisg.humorhazard.netty;

import be.jorisg.humorhazard.PacketHandler;
import be.jorisg.humorhazard.scheduler.Scheduler;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;
import io.netty.handler.codec.http.HttpObjectAggregator;
import io.netty.handler.codec.http.HttpRequestDecoder;
import io.netty.handler.codec.http.HttpResponseEncoder;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

/**
 * Created by Joris on 21/10/2017 in project chatbox.
 */
public class NettyServer {

    private static final Logger logger = LogManager.getLogger(NettyServer.class);

    private final NettyServer instance;
    protected static List<SimpleChannelHandler> channels = new CopyOnWriteArrayList<>();

    private final PacketHandler packetHandler;

    private final String url;
    private final String host;
    private final int port;

    public NettyServer(Scheduler scheduler, PacketHandler packetHandler, String url, String host, int port) {
        this.packetHandler = packetHandler;
        this.url = url;
        this.host = host;
        this.port = port;

        this.instance = this;

        scheduler.repeat(() -> channels.removeIf(sch -> !sch.checkActive()),
                1, TimeUnit.MINUTES);
    }

    public String url() {
        return url;
    }

    public PacketHandler packetHandler() {
        return packetHandler;
    }

    public void start() {
        new Thread(this::run).start();
    }

    private void run() {
        EventLoopGroup bossGroup = new NioEventLoopGroup(1);
        EventLoopGroup workerGroup = new NioEventLoopGroup();
        try {
            ServerBootstrap b = new ServerBootstrap();
            b.group(bossGroup, workerGroup)
                    .channel(NioServerSocketChannel.class)
                    .childHandler(new ChannelInitializer<SocketChannel>() {
                        @Override
                        public void initChannel(SocketChannel ch) {
                            ChannelPipeline p = ch.pipeline();

                            p.addLast("encoder", new HttpResponseEncoder());
                            p.addLast("decoder", new HttpRequestDecoder());
                            p.addLast("aggregator", new HttpObjectAggregator(65536));

                            SimpleChannelHandler sch = new SimpleChannelHandler(instance);
                            channels.add(sch);
                            p.addLast("handler", sch);

                            ch.closeFuture().addListener(future -> channels.remove(sch));
                        }
                    });

            // Start the server.
            ChannelFuture f = b.bind(host, port).sync();
            logger.info("Netty server listening on: " + host + ":" + port);

            f.channel().closeFuture().sync();
        } catch (Exception e) {
            logger.warn(e.getMessage(), e);
        } finally {
            bossGroup.shutdownGracefully();
            workerGroup.shutdownGracefully();
        }
    }

}
