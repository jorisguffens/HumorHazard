package be.jorisg.humorhazard.netty;

import be.jorisg.humorhazard.HumorHazard;
import com.fasterxml.jackson.databind.JsonNode;
import io.netty.channel.ChannelHandlerContext;
import io.netty.channel.SimpleChannelInboundHandler;
import io.netty.handler.codec.http.FullHttpRequest;
import io.netty.handler.codec.http.websocketx.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class SimpleChannelHandler extends SimpleChannelInboundHandler<Object> implements ChannelHandler {

    private static final Logger logger = LogManager.getLogger(SimpleChannelHandler.class);

    private final NettyServer nettyServer;

    private WebSocketServerHandshaker handshaker;
    private StringBuilder frameBuffer = null;

    private long lastHeartbeat = -1;
    private String remoteAddr;

    public SimpleChannelHandler(NettyServer server) {
        this.nettyServer = server;
    }

    protected boolean checkActive() {
        if ( lastHeartbeat == -1 ) { // channel is starting up
            return true;
        }

        if ( System.currentTimeMillis() - lastHeartbeat >= 5 * 60 * 1000 ) { // 5 minutes = 10 heartbeats missed
            ctx.close();
            return false;
        }
        return true;
    }

    @Override
    public void channelActive(ChannelHandlerContext ctx) throws Exception {
        super.channelActive(ctx);
        this.ctx = ctx;
        this.lastHeartbeat = System.currentTimeMillis();
    }

    @Override
    public void channelInactive(ChannelHandlerContext ctx) throws Exception {
        super.channelInactive(ctx);
        nettyServer.packetHandler().handleDisconnect(this);

        if ( remoteAddr != null ) {
            logger.debug("Closed connection from " + remoteAddr);
        }
    }

    @Override
    protected void channelRead0(ChannelHandlerContext ctx, Object msg) {
        if ( msg instanceof FullHttpRequest ) {
            handleHttpRequest(ctx, (FullHttpRequest) msg);
        }
        else if (msg instanceof WebSocketFrame) {
            handleWebSocketFrame(ctx, (WebSocketFrame) msg);
        }
    }

    @Override
    public void exceptionCaught(ChannelHandlerContext ctx, Throwable cause) {
        logger.warn("Error in pipeline, closing connection...", cause);
        ctx.close();
    }

    private void handleWebSocketFrame(ChannelHandlerContext ctx, WebSocketFrame frame) {

        // Check for closing frame
        if ( frame instanceof CloseWebSocketFrame ) {
            if ( frameBuffer != null ) {
                this.onMessage(frameBuffer.toString());
            }

            handshaker.close(ctx.channel(), (CloseWebSocketFrame) frame.retain());
            return;
        }

        // ping
        if ( frame instanceof PingWebSocketFrame ) {
            ctx.channel().writeAndFlush(new PongWebSocketFrame(frame.content().retain()));
            return;
        }

        // pong
        if (frame instanceof PongWebSocketFrame) {
            return;
        }

        // text
        if ( frame instanceof TextWebSocketFrame ) {

            frameBuffer = new StringBuilder();
            frameBuffer.append(((TextWebSocketFrame)frame).text());

        } else if ( frame instanceof ContinuationWebSocketFrame ) {

            if (frameBuffer != null) {
                frameBuffer.append(((ContinuationWebSocketFrame)frame).text());
            } else {
                logger.warn("Continuation frame received without initial frame.");
            }

        } else {
            throw new UnsupportedOperationException(String.format("%s frame types not supported", frame.getClass().getName()));
        }

        // Check if Text or Continuation Frame is final fragment and handle if needed.
        if (frame.isFinalFragment()) {
            this.onMessage(frameBuffer.toString());
            frameBuffer = null;
        }
    }

    private void handleHttpRequest(ChannelHandlerContext ctx, FullHttpRequest req) {

        if ( req.headers().get("X-Real-IP") != null ) {
            remoteAddr = req.headers().get("X-Real-IP") + " (" + req.headers().get("CF-IPCountry") + ")";
        } else {
            remoteAddr = ctx.channel().remoteAddress().toString();
        }

        String upgradeHeader = req.headers().get("Upgrade");
        if ( upgradeHeader == null || !upgradeHeader.equalsIgnoreCase("websocket") ) {
            return;
        }

        WebSocketServerHandshakerFactory wsFactory = new WebSocketServerHandshakerFactory(nettyServer.url(),
                null, false);

        handshaker = wsFactory.newHandshaker(req);
        if ( handshaker == null ) {
            WebSocketServerHandshakerFactory.sendUnsupportedVersionResponse(ctx.channel());
        } else {
            logger.debug("Opening connection from " + remoteAddr);
            handshaker.handshake(ctx.channel(), req);
        }

    }

    // EVENT HANDLING

    private ChannelHandlerContext ctx;

    private void onMessage(String message) {
        if ( message == null || message.equals("undefined") ) return;

        if ( message.equals("heartbeat") ) {
            lastHeartbeat = System.currentTimeMillis();
            return;
        }

        logger.debug("IN " + remoteAddr + ": " + message);

        try {
            JsonNode packet = HumorHazard.objectMapper.readTree(message);
            nettyServer.packetHandler().handle(this, packet);
        } catch (Exception e) {
            logger.error(e.getMessage());
        }
    }

    // INTERFACE

    public void send(String message) {
        logger.debug("OUT " + remoteAddr + ": " + message);
        ctx.channel().writeAndFlush(new TextWebSocketFrame(message));
    }

}
