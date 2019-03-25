//@flow
const fs = require("fs");
const WebSocket = require("ws");
const PacketManager = require("./packetManager.js");

const emitter = require("./emitter.js");
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
  wss.on("connection", (ws) => {
    problemIndex = 0;
    emitter.on("submission", packet => reply(ws, packet));

    ws.on("message", (message: string) => {
      const parsed: Object = JSON.parse(message);
      man.process(parsed);
    });
  });
}


function reply(ws, packet) {
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
          safeSend(ws, JSON.stringify({problem}));
          problemIndex = (problemIndex + 1) % problems.length;
      }
      safeSend(ws, JSON.stringify({action}));
}

function safeSend(ws, message) {
    if (ws.readyState != WebSocket.OPEN) return;
    ws.send(message);
}

module.exports = wsServer;
