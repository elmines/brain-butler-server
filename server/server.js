const ip = require("ip");

const express = require("express");
const socket_io = require("socket.io");

// Local

var app = express();
var httpServer = require("http").createServer(app);
const httpPort = process.env.PORT || 3001;

var io = socket_io(httpServer);

var subjects = io.of("/subjects");
var proctors = io.of("/proctors");

io.on("connection", socket => {

});

subjects.on("connection", socket => {

  socket.on("form", form => {
    proctors.emit("form", form);
  });
  
});
proctors.on("connection", socket => {
  
});

app.use(express.json());

app.post("/api/start", (req, res) => {
  subjects.emit("start");
  proctors.emit("start");
  res.end();
});
app.post("/api/end", (req, res) => {
  subjects.emit("end");
  proctors.emit("end");
  res.end();
});
app.post("/api/submit", (req, res) => {
  subjects.emit("next");
  res.end();
});

const static_assets = `${__dirname}/../dist/`;
app.use(express.static(static_assets));

httpServer.listen(httpPort, () => {
  console.log(`Started listening ${ip.address()}:${httpPort}`);
});