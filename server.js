const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const db = require("./config/db");


const port = 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const rooms = {
  default: {
    name: "Default room"
  },
};


io.on("connection", (socket) => {
  console.log( `${socket.id} har anslutit`);

  socket.on("setUsername", (name) => {
    socket.username = name,
    console.log(socket.username)
  })
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} har lämnat servern pga ${reason}`)
    console.log(socket.username)
  })
  socket.on("chat message", (data) => {
    console.log(` ${socket.id} message : ${data}`)
    socket.to(data.roomName).emit("message received", data);
  })
  socket.on("create_room", (room) => {
    rooms[room] = {
      name: room
    }
    console.log(rooms);
    console.log(room)
    db.serialize(function() {
      console.log('inserting room to database');
      const sql = "INSERT INTO rooms (name) VALUES ('" + room + "')";
      console.log(sql)
      db.run(sql);
    });
  /*  db.serialize(function() {
      const insertRoom =  "INSERT INTO rooms (name) VALUES (?)";
      db.run(insertRoom, [room.roomName]);
    }) */
   
  })


  socket.on("join_room", (room) => {
    console.log(`${socket.id} har anslutit till ${room}`)
    socket.join(room);
    io.to(room).emit("joined_room", socket.id);
   // console.log(socket.rooms)
   
    
    
  })
  socket.on("delete_room", (room) => {
    io.in(room).socketsLeave("room");
  })
 

})

server.listen(port, () => {
  console.log(`Servern körs på port ${port}.`)
});