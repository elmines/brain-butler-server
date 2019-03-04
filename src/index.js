//@flow
const WebSocket = require("ws");
const ip = require("ip");
const PacketManager = require("./packetManager.js");
const log = require("./logging.js").log;

const man: PacketManager = new PacketManager();
const port: number = 8080;
const wss = new WebSocket.Server({port});
log(`BrainButlerServer started at ws://${ip.address()}:${port}`);

wss.on("connection", function connection(ws){

  ws.on("message", function incoming(message: string){
    const parsed: Object = JSON.parse(message);
    man.process(parsed);

  });
});
