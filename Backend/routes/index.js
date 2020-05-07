var express = require('express');
var router = express.Router();

const mysql = require('mysql');
const pool = require('../pool');
const cors = require('../cors');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// User Signup
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  console.log('req', req.body);

  pool.getConnection( async (err, connection) => {
    if (err) {
      console.error("Something went wrong connecting to the database ...");
      throw err;
    }

    let query = 'select * from User_Account where SSN = ' + req.body.SSN;

    await connection.query(query, async (err, result) => {
      console.log('res1: ', result);
      if (err) {
        console.log('err: ', err);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, msg: 'error'});
        connection.release();
        throw err;
      }
  
      if (result.length) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'user exists'});
        connection.release();
      } else {
        let user = {
          SSN: req.body.SSN,
          Name: req.body.Name,
          PhoneNo: req.body.PhoneNo,
          Password: req.body.Password,
          PBAVerified: false,
          BankID: null,
          BANumber: null
        };
  
        // let query1 = 'insert into User_Account(SSN, Name, PhoneNo, PBAVerified, BankID, BANumber) values (' )';
        await connection.query({
          sql: 'insert into Elec_Address(Identifier, Verified) values (?, ?)',
          values: [user.PhoneNo, true],
          timeout: 60000
        }, async (errE, elecRes) => {
          if (errE) {
            console.log('errE: ', errE);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, msg: 'errEor'});
            connection.release();
            throw errE;
            
          }
          console.log('elecRes', elecRes);
          if ( elecRes.affectedRows > 0 ) {
            // Insert into Phone table
            await connection.query({
              sql: 'insert into Phone(PhoneNo) values (?)',
              timeout: 60000,
              values: [user.PhoneNo]
            }, async (err, result1) => {
              console.log('res2: ', result1);
              if (err) {
                console.log('err: ', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, msg: 'error'});
                connection.release();
                throw err;
                
              }
              console.log('len', result1.affectedRows);
              if ( result1.affectedRows > 0 ) {

                // Insert into User_Account
                await connection.query({
                  // sql: 'insert into User_Account(SSN, Name, PhoneNo, PBAVerified, BankID, BANumber) values (?, ?, ?, ?, ?, ?)',
                  sql: 'insert into User_Account(SSN, Name, PhoneNo, Password) values (?, ?, ?, ?)',
                  timeout: 60000,
                  // values: [user.SSN, user.Name, user.PhoneNo, user.PBAVerified, user.BankID, user.BANumber]
                  values: [user.SSN, user.Name, user.PhoneNo, user.Password]
                }, async (err, result2) => {
                  console.log('res3', result2);
                  if (err) {
                    console.log('err: ', err);
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({success: false, msg: 'error'});
                    connection.release();
                    throw err;
                    
                  }
          
                  if ( result2.affectedRows > 0 ) {
                    

                    // getting record which is inserted into db
                    await connection.query({
                      sql: 'select * from User_Account where SSN=' + user.SSN,
                      timeout: 60000
                    }, (err, result3) => {
                      if (err) {
                        console.log('err: ', err);
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: false, msg: 'error'});
                        connection.release();
                        throw err;
                        
                      }
                      console.log('res4', result3);
                      if (result3.length > 0 ) {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({user: result3, success: true, status: 'Registration successful!'});
                        connection.release();
                      } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: false, status: 'Registration failed!'});
                        connection.release();
                      }
                    });
                    
                  }
                });
              } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, status: 'Registration failed!'});
                connection.release();
              }
              
            });
          } else {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, status: 'Registration failed!'});
            connection.release();
          }
        })
        
      }
    });
  });

  

  

});

// User Login
router.post('/login', cors.corsWithOptions, async (req, res, next) => {
  console.log('req: ', req);

  await pool.getConnection( async (err, connection) => {
    if (err) {
      console.error("Something went wrong connecting to the database ...");
      throw err;
    }

    // Get User record from DB
    await connection.query({
      sql: 'select * from User_Account where PhoneNo=' + req.body.PhoneNo,
      timeout: 60000
    }, (err1, result) => {
      if ( err1 ) {
        console.log('err1: ', err1);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, msg: 'error'});
        connection.release();
        throw err1;
      }
      console.log('result: ', result.length);
      if ( result.length > 0 ) {
        console.log('Pass: ', result[0].Password);

        if ( req.body.Password === result[0].Password ) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({user: result[0], success: true, status: 'Login successful!'});
          connection.release();
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, status: 'Wrong Password!'});
          connection.release();
        }
      } else {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, status: 'User not found!'});
        connection.release();
      }
    });
  });
});

module.exports = router;
