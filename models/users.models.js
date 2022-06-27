const db = require("../config/db")

function findOneUser(id) {
    const sql = "SELECT id FROM users WHERE name = '" + data.username +"'";
  
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
    findOneUser,
    
    
  };