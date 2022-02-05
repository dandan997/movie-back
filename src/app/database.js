const mysql = require('mysql2')

const connection = mysql.createPool({
	host:'localhost',
	port:3306,
	user:'root',
	database:'movie',
    password:'Altium1997!'
})

connection.getConnection((err,conn)=>{
    conn.connect((err)=>{
        if(err){
            console.log('连接服务器失败',err)
        }else{
            console.log('连接服务器成功')
        }
    })
})

module.exports = connection.promise()