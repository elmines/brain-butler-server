

const express = require("express");
const app = express();
const static_assets = `${__dirname}/../dist/`;

const httpPort = process.env.PORT || 8080;
const wsPort = process.env.WS_PORT || (httpPort+1);


app.get("/api/start", (req, res) => {
  res.end();
});
app.get("/api/end", (req, res) => {
  res.end();
});
app.get("/api/next", (req, res) => {
  res.end();
});
app.use(express.static(static_assets));
app.listen(httpPort, () => {
  console.log(`Started listening on port ${httpPort}`);
});



