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

  socket.on("end", form => {
    socket.emit("end");
    proctors.emit("end");
  });

});

proctors.on("connection", socket => {
  socket.on("start", () => {
    subjects.emit("start");
  });
  socket.on("submission", data => {
    subjects.emit("submission", data);
    subjects.emit("next");
  })

  socket.on("end", () => {
    socket.emit("end");
    subjects.emit("end");
  });

});

app.use(express.json());

const static_assets = `${__dirname}/../dist/`;
app.use(express.static(static_assets));

httpServer.listen(httpPort, () => {
  console.log(`Started listening at ${ip.address()}:${httpPort}`);
});