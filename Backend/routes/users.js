var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const pool = require('../pool');
const cors = require('../cors');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Get Single User
router.get('/:userId', cors.corsWithOptions, async (req, res, next) => {
  console.log('reqParams: ', req.params);

  await pool.getConnection(async (err, connection) => {
    if (err) {
      console.error("Something went wrong connecting to the database ...");
      throw err;
    }

    let query = 'select * from User_Account where SSN=' + req.params.userId;
    await connection.query({
      sql: query,
      timeout: 60000
    }, async (err1, userAccResult) => {
      if ( err1 ) {
        console.log('err1: ', err1);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({success: false, msg: 'error'});
        connection.release();
        throw err1;
      }

      console.log('userAccResult: ', userAccResult);
      // Get Phone No
      await connection.query({
        sql: 'select * from Phone where PhoneNo=' + userAccResult[0].PhoneNo,
        timeout: 60000
      }, async (err2, phoneResult) => {
        if ( err2 ) {
          console.log('err2: ', err2);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, msg: 'error'});
          connection.release();
          throw err2;
        }

        console.log('phoneResult: ', phoneResult);
        await connection.query({
          sql: 'select EmailAdd, Verified from Email where SSN=' + req.params.userId,
          timeout: 60000
        }, async (err3, emailResult) => {
          if ( err3 ) {
            console.log('err3: ', err3);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({success: false, msg: 'error'});
            connection.release();
            throw err3;
          }

          console.log('emailResult: ', emailResult);
          await connection.query({
            sql: 'select BankId, BANumber, Verified from Has_Additional where SSN=' + req.params.userId,
            timeout: 60000
          }, (err4, addBankAccResult) => {
            if ( err4 ) {
              console.log('err3: ', err3);
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({success: false, msg: 'error'});
              connection.release();
              throw err3;
            }

            console.log('addBankAccResult: ', addBankAccResult);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({
              success: true,
              user: {
                SSN: userAccResult[0].SSN,
                Name: userAccResult[0].Name,
                Password: userAccResult[0].Password,
                PhoneNo: +userAccResult[0].PhoneNo,
                PhoneVerified: phoneResult[0].Verified,
                EmailIds: emailResult,
                Balance: userAccResult[0].Balance,
                BankID: userAccResult[0].BankID,
                BANumber: userAccResult[0].BANumber,
                PBAVerified: userAccResult[0].PBAVerified,
                AddBankAccs: addBankAccResult
              }
            });
            connection.release();
          });
        });
      });
    });
  });
})
// Update User by SSN
.put('/:userId', async (req, res, next) => {
  console.log('reqParams: ', req.params);
  console.log('key', req.body.key);
  await pool.getConnection( async (err, connection) => {
    if ( err ) {
      console.error("Something went wrong connecting to the database ...");
      throw err;
    }

    if ( req.body.key == 'Name' || req.body.key == 'Password' ) {
      await connection.query({
        sql: 'update ' + req.body.table + ' set ' + req.body.key + '="' + req.body.value + '" where SSN=' + req.params.userId,
        timeout: 60000
      }, (err1, result) => {
        if ( err1 ) {
          console.log('err1: ', err1);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, msg: 'error'});
          connection.release();
          throw err1;
        }
  
        console.log('result: ', result);
        if ( result.changedRows > 0 ) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true});
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false});
        }
        connection.release();
      });
    } else if ( req.body.key == 'PhoneNo') {
      await connection.query({
        sql: 'update ' + req.body.table + ' set ' + req.body.key + '=' + req.body.value + ' where PhoneNo=' + req.params.userId,
        timeout: 60000
      }, (err1, result) => {
        if ( err1 ) {
          console.log('err1: ', err1);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, msg: 'error'});
          connection.release();
          throw err1;
        }
  
        console.log('result: ', result);
        if ( result.changedRows > 0 ) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true});
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false});
        }
        connection.release();
      });
    } else {
      await connection.query({
        sql: 'update ' + req.body.table + ' set ' + req.body.key + '=' + req.body.value + ' where SSN=' + req.params.userId,
        timeout: 60000
      }, (err1, result) => {
        if ( err1 ) {
          console.log('err1: ', err1);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, msg: 'error'});
          connection.release();
          throw err1;
        }
  
        console.log('result: ', result);
        if ( result.changedRows > 0 ) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true});
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false});
        }
        connection.release();
      });
    }

    
  });
});

// User Signup
router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  console.log('req', req.body);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Something went wrong connecting to the database ...");
      throw err;
    }

    let query = 'select * from User_Account where SSN = ' + req.body.SSN;

    connection.query(query, (err, result) => {
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

        // Insert into Phone table
        connection.query({
          sql: 'insert into Phone(PhoneNo) values (?)',
          timeout: 60000,
          values: [user.PhoneNo]
        }, (err, result1) => {
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
          if ( result1 ) {

            // Insert into User_Account
            connection.query({
              // sql: 'insert into User_Account(SSN, Name, PhoneNo, PBAVerified, BankID, BANumber) values (?, ?, ?, ?, ?, ?)',
              sql: 'insert into User_Account(SSN, Name, PhoneNo, Password) values (?, ?, ?, ?)',
              timeout: 60000,
              // values: [user.SSN, user.Name, user.PhoneNo, user.PBAVerified, user.BankID, user.BANumber]
              values: [user.SSN, user.Name, user.PhoneNo, user.Password]
            }, (err, result2) => {
              console.log('res3', result2);
              if (err) {
                console.log('err: ', err);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, msg: 'error'});
                connection.release();
                throw err;
                
              }
      
              if ( result2 ) {
                

                // getting record which is inserted into db
                connection.query({
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
                  if (result3) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({user: result3, success: true, status: 'Registration successful!'});
                    connection.release();
                  }
                });
                
              }
            });
          }
          
        });
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
