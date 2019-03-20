//@flow
const fs = require("fs");
const WebSocket = require("ws");
const PacketManager = require("./packetManager.js");
import type EventEmitter from "events";

const emitter: EventEmitter = require("./emitter.js");
const log = require("./logging.js").log;

const man: PacketManager = new PacketManager();

var problemIndex: number = 0;
var problems: Array<Object>;
fs.readFile("./problems.json", function(err, data) {
  const text: string = data.toString()
  problems = JSON.parse(text);
});

function wsServer(port: number = 8080) {
  const wss = new WebSocket.Server({port});

  wss.on("connection", function connection(ws){

    emitter.on("submission", (packet: Object): void => {
      man.process(packet);

      let   sendProblem: boolean = false;
      const       event: string  = packet.name;

      let action: string;
      switch(event) {
        case "startExperiment":
          action = "startExperiment";
          sendProblem = true;
          break;
        case "strategy":
          action = "displayIntertrial";
          sendProblem = true;
          break;
        default:
          action = "displayStrategyPrompt";
      }
      if (sendProblem) {
          const problem: Object = problems[problemIndex].text;
          ws.send(JSON.stringify({problem}));
          problemIndex = (problemIndex + 1) % problems.length;
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
