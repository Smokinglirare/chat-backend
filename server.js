const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const port = 4000;

app.get("/", (req, res) => {
    res.send("<h1>Hello World</h1>");
});

server.listen(port, () => {
    console.log(`Servern körs på port ${port}.`)
});