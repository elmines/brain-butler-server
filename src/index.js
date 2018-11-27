//@flow
const WebSocket = require("ws");
const ip = require("ip");

import type {Command, EegEpoch, Message, Role} from "brain-butler-schema";


const port: number = 8080;

function log(role: string, message: string = "", level: string ="I")
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
  ws.on("message", function incoming(message: string){
    const parsed: Message = JSON.parse(message);
    log(parsed.role, parsed.toString());

    if (parsed.role == "eeg")
    {
        const eegMessage: EegEpoch = (parsed.body: EegEpoch);
        processEEG(eegMessage);
    }
  });
});
