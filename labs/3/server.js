const http = require("http");
const url = require("url")
const PORT = 3001;

const Messages = require("./lang/en/en")
const dateUtils = require("./modules/utils")
const dateHelper = dateUtils.dateTime
const routes = {
    "GET": {
        "/getDate": (req, res, query) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`${Messages.WELCOME.replace(`%1`, query["name"])} ${dateHelper.getDate()}`);
        },
    },
    "POST": {

    }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    const handler = routes[req.method]?.[pathname];
    if (handler) {
        handler(req, res, query);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
