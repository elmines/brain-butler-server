//@flow
const WebSocket = require("ws");
const ip = require("ip");

import type {EegEpoch, Message, Role} from "brain-butler-schema";


const port: Number = 8080;

function log(role: String, message: String = "", level: String ="I")
{
   if (!role) role = "UNKNOWN";

   console.log(`${level} ${role} ${new Date(Date.now()).toLocaleString()}: ${message}`);
}

function processEEG(data: EegEpoch)
{
}


const wss = new WebSocket.Server({port});
log("SERVER", `BrainButlerServer started at ws://${ip.address()}:${port}`);

wss.on("connection", function connection(ws){
  ws.on("message", function incoming(message: String){
    const parsed: Message = JSON.parse(message);
    log(parsed.role, parsed);

    if (parsed.role == "eeg")
    {
        processEEG(parsed);
    }
  });
});
