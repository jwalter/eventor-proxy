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

const PORT=process.env.PORT; 

function handleRequest(request, response) {
    if (request.url.startsWith('/api'))
    {
        options["path"] = request.url;
        options.headers["ApiKey"] = request.headers["apikey"];
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

server.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server listening on: http://%s:%s", process.env.IP, process.env.PORT);
});

