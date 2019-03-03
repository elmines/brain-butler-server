//@flow
const fs = require("fs");
const log = require("./logging.js").log;

class PacketManager {

  constructor(log: boolean = true) {
    this.log = log;
    this.outPath = "";
  }

  process(packet: Object) : void {

    switch(packet.type) {
      case "header": this.processHeader(packet); return;
      case "eof":    this.processEof(packet);    return;
      case "data":   this.processData(packet);   return;
      case "event":  this.processEvent(packet); return;

      default:
        log(`Received packet of unknown type ${packet.type}--rejecting`, "W");
        return;
    }
  }

  processHeader(packet: Object) {

  }
  processEof(packet: Object) {

  }
  processData(packet: Object) {

  }
  processEvent(packet: Object) {

  }

  openFile(prefix: string = "data") {
    const path: string = prefix + "_" + dateStr() + ".json";
  }

  outPath: string;
  log: boolean;

}

function dateStr() : string {
    const date: Date = new Date(Date.now());
    return date.getFullYear() + "_" + date.getMonth() + "_" + date.getDate()
      + "_" + date.getHours()    + ":" + date.getMinutes() + ":" + date.getSeconds();
}



module.exports = PacketManager;
