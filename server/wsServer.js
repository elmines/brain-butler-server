// Node library
const ip = require("ip");
const WebSocket = require("ws");

function wsServer(port) {
    const wss = new WebSocket.Server({port});
    console.log(`WebSocket server listening at ${ip.address()}:${port}`);

    wss.on("open", () => {
    });

    wss.on("connection", ws => {
        console.log(`Got a connection`);

        ws.on("message", data => {
            //console.log(data);

        });
    })

    wss.on("close", () => {

    });

    wss.on("error", () => {

    });

    return wss;
}

module.exports = wsServer;