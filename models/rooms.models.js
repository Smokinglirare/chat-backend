const db = require("../config/db")

function findOneRoom(id) {
    const sql = "SELECT id FROM rooms WHERE name = '" + data.roomName +"'";
  
    return new Promise((resolve, reject) => {
      db.get(sql, id, (error, rows) => {
        if (error) {
          console.error(error.message);
          reject(error);
        }
        resolve(rows);
        console.log(rows);
      });
    });
  }

  module.exports = {
    findOneRoom,
    
    
  };
  //const checkRoomId = "select id from rooms where name = '" + data.roomName +"'";
  //    db.get
