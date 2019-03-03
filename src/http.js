const http = require("http");
const fs = require("fs");

http.createServer(function(req, res) {

	if (req.method == "GET") {
		fs.readFile("answer.html", function(err, data) {
			res.writeHead(200, {"Content-type": "text/html"});
			res.write(data);
			res.end();
		});
	}
	else if (req.method == "POST") {

		console.log("req.url = "+req.url);
		var resPath;

		if (req.url === "/answer") {
			resPath = "method.html";
		}
		else {
			resPath = "answer.html";
		}


		fs.readFile(resPath, function(err, data) {
			res.writeHead(200, {"Content-type": "text/html"});
			res.write(data);
			res.end();
		});
	}


}).listen(8080);
