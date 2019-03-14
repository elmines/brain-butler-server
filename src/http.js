//@flow
const ip = require("ip");
const http = require("http");
const fs = require("fs");
const { parse } = require("querystring");
import type EventEmitter from "events";

const emitter = require("./emitter.js");
const log = require("./logging.js").log;


function httpServer(port: number = 8079) {
  http.createServer(function(req, res) {
	  if (req.method == "GET") {

      var filePath : string;
      if (req.url === "/dashboard") filePath = "dashboard.html";
      else filePath = "index.html";


		  fs.readFile(filePath, function(err, data) {
			  res.writeHead(200, {"Content-type": "text/html"});
			  res.write(data);
			  res.end();
		  });
	  }
	  else if (req.method == "POST") {
		  const resPath: string = "dashboard.html";

		  fs.readFile(resPath, function(err, data) {
			  res.writeHead(200, {"Content-type": "text/html"});
			  res.write(data);

			  let body = "";
			  req.on("data", chunk => {
				  body += chunk.toString();
			  });
			  req.on("end", () => {
          let packet: Object = parse(body);
          packet.timestamp = Date.now();
          emitter.emit("submission", packet);
				  res.end();
			  });
		  });
    }
  }).listen(port);
}
module.exports = httpServer;
