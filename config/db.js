const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite", (error) => {
  if (error) {
    console.log(error.message);
    throw error;
  }

  
  const messagesStatement = `
       CREATE TABLE messages (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           message TEXT,
           room_id TEXT,
           user_id INTEGER,
           created TEXT
           
       )
    `;

  const roomsStatement = `
  CREATE TABLE rooms (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    FOREIGN KEY (name)
    REFERENCES messages (room_id)
    ON DELETE CASCADE
  )
  `
  const usersStatement = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
  )
  `


  db.run(roomsStatement, (error) => {
    if (error) {
      console.error(error.message);
    } else {
      const insert = "INSERT INTO rooms (name) VALUES (?)";
      db.run(insert, ["Hemliga rummet"]);
    }
  });


db.run(usersStatement, (error) => {
  if (error) {
    console.error(error.message);
  } else {
    const insert = "INSERT INTO users ( name) VALUES (?)";
    db.run(insert, ["Sebbe"]);
  }
});


db.run(messagesStatement, (error) => {
  if (error) {
    console.error(error.message);
  } else {
    const insert = "INSERT INTO messages ( message, room_id, user_id, created) VALUES ( ?,?, ? ,? )";
    db.run(insert, ["Hej hur är läget?", 1, 1, "2018-01-03 08:50:18"]);
  }
});

});
module.exports = db;
