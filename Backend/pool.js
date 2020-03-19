const util = require('util');
const mysql = require('mysql');
const config = require('./config');
/**
 * Connection to the database.
 *  */
const pool = mysql.createPool({
    connectionLimit: 10,
    host: config.sqlhost,
    user: config.sqluser, // use your mysql username.
    password: config.sqlpwd, // user your mysql password.
    database: config.sqldatabse,
    port: 3307
});

// pool.getConnection((err, connection) => {
//     if(err) 
//         console.error("Something went wrong connecting to the database ...");
    
//     if(connection)
//         connection.release();
//     return;
// });

// pool.query = util.promisify(pool.query);

module.exports = pool;