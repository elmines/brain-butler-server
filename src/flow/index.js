//@flow
const ip = require("ip");
const log = require("./logging.js").log;

const wsServer = require("./ws.js");
const httpServer = require("./http.js");

const wsPort: number = 8080;
const httpPort: number = 8079;

log(`WebSocket server started at ws://${ip.address()}:${wsPort}`);
wsServer(wsPort);
log(`HTTP server started at http://${ip.address()}:${httpPort}`);
httpServer(httpPort);
