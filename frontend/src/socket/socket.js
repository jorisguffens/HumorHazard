export function Socket(url) {

    const self = this;

    const events = {
        'open': [],
        'close': [],
        'receive': []
    };

    let queue = [];
    let reconnecting = false;
    let websocket;

    const heartbeat = function () {
        if (websocket != null && websocket.readyState === 1) {
            websocket.send("heartbeat"); // keep the connection alive
        }
        setTimeout(heartbeat, 30000);
    };
    heartbeat();

    this.close = function () {
        websocket.close();
    }

    this.connect = function () {
        if (websocket != null) {
            return;
        }

        try {
            websocket = new WebSocket(url);
        } catch (ex) {
            console.log(ex);

            websocket = null;
            reconnect();
            return;
        }

        websocket.onopen = onopen;
        websocket.onclose = onclose;
        websocket.onmessage = onmessage;
    };

    const reconnect = function () {
        if (websocket != null || reconnecting) {
            return;
        }

        reconnecting = true;
        setTimeout(function () {
            reconnecting = false;
            self.connect();
        }, 1000);
    };

    this.send = function (message) {
        if (typeof message !== "string" && !(message instanceof String)) {
            message = JSON.stringify(message);
        }

        if (websocket.readyState !== 1) {
            queue.push(message);
            return;
        }

        if (window.internalDebug) {
            console.log("OUT -> " + message);
        }
        websocket.send(message);
    };

    const onopen = function () {
        events['open'].map((item) => item())

        for (let i = 0; i < queue.length; i++) {
            self.send(queue[i]);
        }
        queue = [];
    };

    const onclose = function () {
        events['close'].map((item) => item())
        websocket = null;
        reconnect();
    };

    const onmessage = function (event) {
        if (event.data === null) return;
        const response = event.data;

        if (window.internalDebug) {
            console.log("IN <- " + response);
        }

        let json;
        try {
            json = JSON.parse(response);
        } catch (ignored) {
            console.err("Invalid json received.");
            return;
        }

        events['receive'].map((item) => item(json))
    };

    this.registerListener = function (type, func) {
        events[type].push(func);
    }

}