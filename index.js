var http = require("http");
var parser = require("xml2json");

var options = {
  "method": "GET",
  "hostname": "eventor.orientering.se",
  "port": null,
  "path": "/api/organisation/610",
  "headers": {
    "apikey": "",
    "cache-control": "no-cache"
  }
};

const PORT=8080; 

function handleRequest(request, response) {
    if (request.url.startsWith('/api'))
    {
        options["path"] = request.url;
        var req = http.request(options, function (res) {
            var chunks = [];

            res.on("data", function (chunk) {
                chunks.push(chunk);
            });

            res.on("end", function () {
                var body = Buffer.concat(chunks).toString();
                if (res.statusCode === 200) {
                    response.setHeader('Content-Type', 'application/json');
                    body = parser.toJson(body)
                }
                response.end(body);
            });
        });
        req.end();
    } else {
        response.end(request.url);
    }
}

var server = http.createServer(handleRequest);

server.listen(PORT, function() {
    console.log("Server listening on: http://localhost:%s", PORT);
});

