const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./db.sqlite", (error) => {
  if (error) {
    console.log(error.message);
    throw error;
  }
  db.get("PRAGMA foreign_keys = ON")
  
  
  const messagesStatement = `
       CREATE TABLE messages (
           id INTEGER PRIMARY KEY ,
           message TEXT,
           room_name TEXT,
           user_id INTEGER,
           created TEXT
           
       )
    `;

  const roomsStatement = `
  CREATE TABLE rooms (
    id INTEGER PRIMARY KEY,
    room_name TEXT
    
  )
  `
  const usersStatement = `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY ,
    name TEXT
  )
  `
  db.run(messagesStatement, (error) => {
    if (error) {
      console.error(error.message);
    } else {
      const insert = "INSERT INTO messages ( message, room_name, user_id, created) VALUES ( ?,?, ? ,? )";
      db.run(insert, ["Hej hur är läget?", "gurras rum", "peter pan", "2018-01-03 08:50:18"]);
    }
  });

  db.run(roomsStatement, (error) => {
    if (error) {
      console.error(error.message);
    } else {
      const insert = "INSERT INTO rooms (room_name) VALUES (?)";
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




});
module.exports = db;

//FOREIGN KEY (id)
  //     REFERENCES messages (id) 
    // ON DELETE CASCADE