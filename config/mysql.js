const mysql = require('mysql');


// const dbconfig = {
//   host: 'localhost',
//   port: '3306',
//   user: 'root',
//   password: 'abc',
//   database: 'inthem'
// }

// const conenction = mysql.createConnection(dbconfig);

const mysqlConnection = {
  init : function(){
    return mysql.createConnection({
      host: process.env.host,
      port: process.env.port,
      user: process.env.user,
      password: process.env.password,
      database: process.env.database,
      multipleStatements : true  //여러 쿼리를 ';' 기준으로 한번에 보낼 수 있게 함.
    });
  },
  open: (con)=>{
    con.connect(err =>{
      if(err){
        console.log("MySQL 연결 실패 : ", err);
      } else{
        console.log("MySQL Connected!");
      }
    });
  },
  close: (con)=>{
    con.end(err =>{
      if(err) {
        console.log("MySQL 종료 실패 :", err);
      } else{
        console.log("MySQL Terninated");
      }
    })
  }
}

module.exports = mysqlConnection;