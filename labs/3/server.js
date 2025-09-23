const http = require("http");
const url = require("url")
const PORT = 3002;

const Messages = require("./lang/en/en")
const Utils = require("./modules/utils")
const dateHelper = Utils.dateTime
const fileHelper = Utils.fileHelper

class Endpoints {
    static GET_DATE = "/getDate"
    static READ_FILE = "/readFile"
    static WRITE_FILE = "/writeFile/"
}

const routes = {
    GET: {
        [Endpoints.GET_DATE]: (req, res, query) => {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(`${Messages.WELCOME.replace("%1", query["name"])} ${dateHelper.getDate()}`);
        },
        [Endpoints.READ_FILE]: (req, res, fileName) => {
            const contents = fileHelper.readFile(fileName);
            if (contents === null) {
                res.writeHead(404, { "Content-Type": "text/plain" });
                res.end(`File "${fileName}" not found`);
            } else {
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end(contents);
            }
        },
    },
    POST: {
        [Endpoints.WRITE_FILE]: (req, res, query) => {
            const text = query["text"]
            fileHelper.writeFile(text)
            res.end()
        },
    }
};

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname.startsWith(`/readFile`) && req.method === "GET") {
        const fileName = decodeURIComponent(pathname.replace(`/readFile/`, ""));
        routes.GET[Endpoints.READ_FILE](req, res, fileName);
        return;
    }

    const handler = routes[req.method]?.[pathname];
    if (handler) {
        handler(req, res, query);
    } else {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");
    }
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
