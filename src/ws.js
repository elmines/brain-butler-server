//@flow
const WebSocket = require("ws");
const PacketManager = require("./packetManager.js");
import type EventEmitter from "events";

const emitter: EventEmitter = require("./emitter.js");
const log = require("./logging.js").log;

const man: PacketManager = new PacketManager();

function wsServer(port: number = 8080) {
  const wss = new WebSocket.Server({port});

  wss.on("connection", function connection(ws){

    emitter.on("submission", (packet: Object): void => {
      man.process(packet);

      const event: string = packet.name;
      //const action = (event == "strategy") ? "displayIntertrial": "displayStrategyPrompt";

      let action: string;
      switch(event) {
        case "startExperiment":
          action = "startExperiment";
          break;
        case "strategy":
          action = "displayIntertrial";
          break;
        default:
          action = "displayStrategyPrompt";
      }

      ws.send(JSON.stringify({action}));
    });

    ws.on("message", function incoming(message: string){
      const parsed: Object = JSON.parse(message);
      man.process(parsed);
    });
  });
  return wss;
}

module.exports = wsServer;
