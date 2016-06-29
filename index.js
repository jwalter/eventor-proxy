var http = require("http");
var parser = require("xml2json");

var options = {
  "method": "GET",
  "hostname": "eventor.orientering.se",
  "port": null,
  "path": "/api/organisation/610",
  "headers": {
    "cache-control": "no-cache"
  }
};

const IP = process.env.IP || "localhost";
const PORT = process.env.PORT || 8080;

function handleRequest(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'apikey');
    if (request.url.startsWith('/api'))
    {
        options["path"] = request.url;
        options.headers["ApiKey"] = request.headers["apikey"] || '';
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

server.listen(PORT, IP, function() {
    console.log("Server listening on: http://%s:%s", IP, PORT);
});

