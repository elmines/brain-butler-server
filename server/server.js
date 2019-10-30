const path = require("path");
const fs = require("fs");

const ip = require("ip");

const express = require("express");
const socket_io = require("socket.io");


var app = express();
var httpServer = require("http").createServer(app);
const httpPort = process.env.PORT || 3001;
const outDir = path.normalize(process.env.OUT_DIR || "../out");

class History {
  constructor() {
    this.path = path.join(outDir,`${Date.now()}_history.json`);
    this.fd = fs.openSync(this.path, "a");
    this.history = [];
    this.bufferLim = 50;
    this.empty = true;

    fs.appendFile(this.fd, "[", err => {});
  }

  record(datum) {
    this.history.push(datum);
    if (this.history.length > this.bufferLim) this.flush();
  }

  flush() {
    if (this.history.length < 1) return;

    let json = JSON.stringify(this.history, null, 2);
    json = json.substring(1, json.length - 1);

    let toWrite = "\n" + json;
    if (this.empty) this.empty = false;
    else            toWrite = "," + toWrite;

    fs.appendFile(this.fd, toWrite, err => {
      if (err) {
        console.log(`Error writing to ${this.path}`);
        return;
      }
      console.log(`Flushed ${toWrite.length} bytes to ${this.path}`);
    });
    this.history = [];
  }

  close() {
    this.flush();
    fs.appendFile(this.fd, "\n]", err => {
      if (err) {
        console.log(`Error writing to ${this.path}`);
        return;
      }
      console.log(`Wrote ${this.path}`);
    });
  }
}

var hist = new History();
function writeHistory() {
  const timestamp = Date.now();
  hist.record({type:"end", timestamp});
  hist.close();
  hist = new History();
}

var io = socket_io(httpServer);
var subjects = io.of("/subjects");
var proctors = io.of("/proctors");

function onPause() {
  hist.record({type: "requestPause", timestamp: Date.now()});
  proctors.emit("pause");
  subjects.emit("pause");
}

io.on("connection", socket => {

});

subjects.on("connection", socket => {
  socket.on("form", form => {
    proctors.emit("form", form);
  });

  socket.on("event", event => {
    hist.record(event);
  });

  socket.on("end", form => {
  });

  socket.on("pause",onPause);

});

proctors.on("connection", socket => {

  socket.on("start", () => {
    subjects.emit("start");
    hist.record({type:"start", timestamp:Date.now() });
  });

  socket.on("submission", data => {
    hist.record(data);

    subjects.emit("submission", data);
    subjects.emit("next");
  })

  socket.on("end", () => {
    writeHistory();
    proctors.emit("end");
    subjects.emit("end");
  });

  socket.on("continue", () => {
    hist.record({type: "continue", timestamp: Date.now()});
    proctors.emit("continue");
    subjects.emit("continue");
  })

  socket.on("pause", onPause);

});

app.use(express.json());

const static_assets = `${__dirname}/../dist/`;
app.use(express.static(static_assets));

httpServer.listen(httpPort, () => {
  console.log(`Started listening at ${ip.address()}:${httpPort}`);
});