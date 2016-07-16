var http = require("http");
var parseString = require("xml2js").parseString;

var options = {
  "method": "GET",
  "hostname": "eventor.orientering.se",
  "port": null,
  "path": "/api/organisation/610",
  "headers": {
    "cache-control": "no-cache"
  }
};

const IP = process.env.IP || "airnst.local";
const PORT = process.env.PORT || 8080;

function handleRequest(request, response) {
    var startTime = new Date().getTime();
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', 'apikey');
    if (request.url.startsWith('/api'))
    {
        if (request.method === 'OPTIONS') {
            response.end();
        } else {
            options["path"] = request.url;
            options.headers["ApiKey"] = request.headers["apikey"] || '';
            var req = http.request(options, function (res) {
                var chunks = [];

                res.on("data", function (chunk) {
                    chunks.push(chunk);
                });

                res.on("end", function () {
                    var eventorEndTime = new Date().getTime();
                    console.log("Read response from Eventor in " + (eventorEndTime - startTime) + " ms");
                    var body = Buffer.concat(chunks).toString();
                    if (res.statusCode === 200) {
                        response.setHeader('Content-Type', 'application/json');
                        toJson(body, function(json) {
                            response.end(json); 
                            var endTime = new Date().getTime();
                            console.log("Finished in " + (endTime - startTime) + " ms");
                        });
                    } else {
                        response.end(body);
                    }
                });
            });
            req.end();
        }
    } else {
        response.end(request.url);
    }
}

function toJson(xml, callback) {
    parseString(xml, function(err, result) {
       callback(JSON.stringify(result)); 
    });
}

var server = http.createServer(handleRequest);

server.listen(PORT, IP, function() {
    console.log("Server listening on: http://%s:%s", IP, PORT);
});

