const e = require("express");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const fs = require("fs");

const db = require("./config/db");

const port = 4000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const rooms = {
  default: {
    name: "Default room",
  },
};

io.on("connection", (socket) => {
  socket.use(([event, ...args], next) => {
    const date = new Date().toLocaleString("it-IT");
    console.log(date);
    if (
      event === "chat message" &&
      args.length === 1 &&
      args[0].hasOwnProperty("chatMessage") &&
      args[0].chatMessage !== ""
    ) {
      fs.appendFile(
        "./config/log.txt",
        `${JSON.stringify(args) + date} \r\n`,
        function (err) {
          if (err) {
            throw err;
          } else {
            console.log("Sparade information till log.txt");
          }
        }
      );
    }

    next();
  });
  console.log(`${socket.id} har anslutit`);

  socket.on("setUsername", (name) => {
    (socket.username = name),
      //  console.log(socket.username)
      //  console.log(name)
      // users[socket.id] = name
      console.log(name);

    db.serialize(function () {
      const sql = "INSERT INTO users (name) VALUES ('" + name + "')";
      console.log(sql);
      db.run(sql);
    });
  });
  socket.on("disconnect", (reason) => {
    console.log(`${socket.id} har lämnat servern pga ${reason}`);
  });
  socket.on("chat message", (data) => {
    if (data.chatMessage !== "") {
      console.log(` ${socket.id} message : ${data}`);
      socket.to(data.roomName).emit("message received", data);
      db.serialize(function () {
        const sql =
          "INSERT INTO messages ( message, room_name, user_id, created) VALUES ('" +
          data.chatMessage +
          "','" +
          data.roomName +
          "','" +
          data.username +
          "', datetime('now','localtime') );";
        // const sql = "INSERT INTO messages ( message, room_id, user_id, created) VALUES ('" + data.chatMessage + "','"+ data.roomName +"', '"+ data.username +"',  + "2018-01-03 08:50:182" +);"
        console.log(sql);
        db.run(sql);
      });
    }
  });
  socket.on("create_room", (room) => {
    rooms[room] = {
      name: room,
    };
    console.log(rooms);
    console.log(room);
    db.serialize(function () {
      const checkRoom =
        "select count(*) from rooms where room_name = '" + room + "'";
      db.get(checkRoom, function (err, row) {
        if (row["count(*)"] !== 0) {
          console.log("Rummet finns redan.");

          return;
        } else {
          const sql = "INSERT INTO rooms (room_name) VALUES ('" + room + "')";
          console.log(sql);
          db.run(sql);
        }
      });
      /*  db.serialize(function() {
      const insertRoom =  "INSERT INTO rooms (name) VALUES (?)";
      db.run(insertRoom, [room.roomName]);
    }) */
    });
  });

  socket.on("join_room", (room) => {
   /* db.serialize(function () {
      const sql = "select * from messages where room_name = '" + room + "'";
      db.all(sql, function (err, rows) {
        socket.to(room).emit("oldMessages", rows);
        console.log(rows);
      });
    }); */

    db.serialize(function () {
      const sql =  "select count(*) from rooms where room_name = '" + room + "'";
      db.get(sql, function (err, row) {
         if (row["count(*)"] !== 0) {
          console.log(row);
        console.log(`${socket.id} har anslutit till ${room}`);
        socket.join(room);
        io.to(room).emit("joined_room", socket.id);
        } else {
          const sql = "INSERT INTO rooms (room_name) VALUES ('" + room + "')";
          console.log(sql);
          db.run(sql);
          console.log("vafalls")
          return;
        }
      });
    });
  });
  socket.on("delete_room", (room) => {
    io.in(room).socketsLeave("room");
    db.serialize(function () {
      const sql = "DELETE FROM rooms WHERE room_name = '" + room + "';";
      console.log(sql);
      db.run(sql);
    });
    db.serialize(function () {
      const sql = "DELETE FROM messages WHERE room_name = '" + room + "';";
      console.log(sql);
      db.run(sql);
    });
  });

  db.serialize(function () {
    const sql = "SELECT room_name FROM rooms";
    console.log(sql);
    db.all(sql, (err, rows) => {
      socket.emit("allRooms", rows);
    });
  });
});

server.listen(port, () => {
  console.log(`Servern körs på port ${port}.`);
});
