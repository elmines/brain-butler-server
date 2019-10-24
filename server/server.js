const path = require("path");
const fs = require("fs");

const ip = require("ip");

const express = require("express");
const socket_io = require("socket.io");


var app = express();
var httpServer = require("http").createServer(app);
const httpPort = process.env.PORT || 3001;
const outDir = path.normalize(process.env.OUT_DIR || "../out");

var history = [];
function recordEvent(data) { history.push(data); }
function clearHistory() { history = []; }
function writeHistory() {
  const timestamp = Date.now();
  recordEvent({type:"end", timestamp});
  const out_path = path.join(outDir,`${timestamp}_history.json`);
  const json_string = JSON.stringify(history, null, 2);
  fs.writeFile(out_path, json_string, err => {
    if (err) console.error(`Unable to write ${path}`);
    else     console.error(`Wrote ${out_path}`);
    clearHistory();
  });
}

var io = socket_io(httpServer);
var subjects = io.of("/subjects");
var proctors = io.of("/proctors");

io.on("connection", socket => {

});

subjects.on("connection", socket => {
  socket.on("form", form => {
    proctors.emit("form", form);
  });

  socket.on("event", event => {
    recordEvent(event);
  });

  socket.on("end", form => {
  });

});

proctors.on("connection", socket => {

  socket.on("start", () => {
    subjects.emit("start");
    recordEvent({type:"start", timestamp:Date.now() });
  });

  socket.on("submission", data => {
    recordEvent(data);

    subjects.emit("submission", data);
    subjects.emit("next");
  })

  socket.on("end", () => {
    writeHistory();
    proctors.emit("end");
    subjects.emit("end");
  });

});

app.use(express.json());

const static_assets = `${__dirname}/../dist/`;
app.use(express.static(static_assets));

httpServer.listen(httpPort, () => {
  console.log(`Started listening at ${ip.address()}:${httpPort}`);
});