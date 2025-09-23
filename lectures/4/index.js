const express = require("express");
const http = require("http")
const app = express();

const PORT = process.env.PORT || 3000;

http.createServer(function (req, res) {
    res.writeHead(200, {"Content-type": "text/html", "Access-Control-Allow-Origin": "*"})
    res.end("Hello <b> World! </b>")
}).listen(3000)

console.log("Server is running and listening")

// app.get("/test", (req, res) => {
//     res.json({ message: "Test endpoint works!" });
// });

// app.post("/test", (req, res) => {
//     res.json({ message: "POST Test endpoint works!" })
// })

// app.listen(PORT, () => {
//     console.log(`Server running at http://localhost:${PORT}`);
// });
