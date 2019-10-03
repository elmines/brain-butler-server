// Node library
const ip = require("ip");
const WebSocket = require("ws");

function wsServer(port) {
    const wss = new WebSocket.Server({port});
    console.log(`WebSocket server listening at ${ip.address()}:${port}`);

    wss.on("open", () => {
    });

    wss.on("connection", ws => {
        ws.on("message", mess => {

        });
    });

    wss.on("close", () => {

    });

    wss.on("error", () => {

    });

    return wss;
}

module.exports = wsServer;