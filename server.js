const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");


const port = 4000;

const io = new Server(server, {
    cors: {
        origin: "*",
      methods: ["GET", "POST"]
    }
  });



io.on("connection", (socket) => {
    console.log("En användare har anslutit");

    socket.on("disconnect", () => {
        console.log("En användare har lämnat")
    })

    socket.on("chat message", (data) => {
        console.log(`message : ${data}`)
        io.emit("chat message", data);
})

})

server.listen(port, () => {
    console.log(`Servern körs på port ${port}.`)
});