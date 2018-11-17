const WebSocket = require("ws");
const ip = require("ip");
//Incoming Message Schema:
//role Incoming = {
  //role: "eeg" | "gyro" | "acc" | "orient",
  //data:
//}

class BrainButlerServer
{
  constructor(port = 8080)
  {
    this.wss = new WebSocket.Server({port});
    this.log("SERVER",
      `BrainButlerServer started at ws://${ip.address()}:${port}`);

    this.wss.on("connection", function connection(ws){
      ws.on("message", function incoming(message){
        const parsed = JSON.parse(message);
        this.log(parsed);

        if (parsed.role == "eeg")
        {
            processEEG(data);
        }
      });
    });

  }

  log(role, message = "", level="I")
  {
     if (!role) role = "UNKNOWN";

     console.log(`${level} ${role} ${new Date(Date.now()).toLocaleString()}: ${message}`);
  }

  processEEG(data)
  {
    console.log(`EEG data ${data}`);
  }

}


new BrainButlerServer()
