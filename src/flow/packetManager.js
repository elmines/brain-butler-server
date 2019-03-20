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
      case "header": this._processHeader(packet); return;
      case "eof":    this._processEof(packet);    return;
      case "data":   this._processData(packet);   return;
      case "event":  this._processEvent(packet); return;

      default:
        log(`Received packet of unknown type ${packet.type}--rejecting`, "W");
        return;
    }
  }

  _processHeader(packet: Object) : void {
    const path: string = `data_${dateStr()}.json`;
    fs.writeFile(path, "[" + JSON.stringify(packet), (err) => {
      if (err) throw err;
      this.outPath = path;
      log(`Started new output file ${this.outPath}`);
    });
  }

  _processEof(packet: Object) : void {
    if (!this.outPath) return;
    fs.appendFile(this.outPath, "]", (err) => {
      if (err) throw err;
      log(`Ended output file ${this.outPath}`);
      this.outPath = "";
    });
  }
  _processData(packet: Object) : void {
    if (!this.outPath) return;
    fs.appendFile(this.outPath, ","+JSON.stringify(packet), (err) => {
        if (err) throw err;
    });
  }
  _processEvent(packet: Object) : void {
    if (!this.outPath) return;
    fs.appendFile(this.outPath, ","+JSON.stringify(packet), (err) => {
        if (err) throw err;
    });
  }


  outPath: string;
  log: boolean;
}

function dateStr() : string {
    const date: Date = new Date(Date.now());
    return `${date.getFullYear()}.${date.getMonth()+1}.${date.getDate()}` +
    `_${date.getHours()}.${date.getMinutes()}.${date.getSeconds()}`;
}



module.exports = PacketManager;
