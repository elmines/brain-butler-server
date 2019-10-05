const ip = require("ip");

const express = require("express");
const socket_io = require("socket.io");

// Local
//const wsServer = require("./wsServer.js");
const FormManager = require("./FormManager.js");

var app = express();
var httpServer = require("http").createServer(app);
var io = socket_io(httpServer);
const httpPort = process.env.PORT || 3001;

const manager = new FormManager();

io.on("connection", socket => {
  socket.on("form", (form) => {
    manager.receiveForm(form);
  });
});

app.use(express.json());

app.post("/api/start", (req, res) => {
  io.sockets.emit("start");
  res.end();
});
app.post("/api/end", (req, res) => {
  manager.clear();
  io.sockets.emit("end");
  res.end();
});
app.post("/api/submit", (req, res) => {
  io.sockets.emit("next");
  res.end();
});

app.get("/api/form", (req, res) => {
  res.send(JSON.stringify(manager.next()));
});

const static_assets = `${__dirname}/../dist/`;
app.use(express.static(static_assets));

httpServer.listen(httpPort, () => {
  console.log(`Started listening ${ip.address()}:${httpPort}`);
});