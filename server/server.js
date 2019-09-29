// Node
const ip = require("ip");

// 3rd Party
const express = require("express");

// Local
const wsServer = require("./wsServer.js");
const FormManager = require("./FormManager.js");

const httpPort = process.env.PORT || 3001;
const wsPort = process.env.WS_PORT || (httpPort+1);
const wss = wsServer(wsPort);
const manager = new FormManager(wss)


const app = express();
const static_assets = `${__dirname}/../dist/`;

app.use(express.json());

app.post("/api/start", (req, res) => {
  res.end();
});
app.post("/api/end", (req, res) => {
  res.end();
});
app.post("/api/submit", (req, res) => {
  console.log("Got a submission:");
  console.log(req.body);
  res.end();
});

app.get("/api/form", (req, res) => {
  res.send(JSON.stringify(manager.nextForm()));
});



app.use(express.static(static_assets));
app.listen(httpPort, () => {
  console.log(`Started listening ${ip.address()}:${httpPort}`);
});



