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

    // let query = 'select * from (User_Account ua left outer join Email e ' +
    //   'on ua.SSN = e.SSN) left outer join Has_Additional ha on e.SSN = ha.SSN ' +
    //   'where ua.SSN=' + req.params.userId + ' and e.SSN=' + req.params.userId;
    
    // await connection.query({
    //   sql: query,
    //   timeout: 60000
    // }, (err1, result) => {
    //   if ( err1 ) {
    //     console.log('err1: ', err1);
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type', 'application/json');
    //     res.json({success: false, msg: 'error'});
    //     connection.release();
    //     throw err1;
    //   }

    //   console.log('res: ', result);
    // });

    console.log('query', req.query.emailid);
    if ( req.query.emailid != undefined ) {
      await connection.query({
        sql: 'select * from Email where EmailAdd="' + req.query.emailid + '"',
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

        console.log('emailVerifyResult: ', result);
        if ( result.length > 0 ) {
          console.log('yoloyolo');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({existing: true});
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({existing: false});
        }
        connection.release();
      });
    } else {
      console.log('yolo');
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
            sql: 'select id, EmailAdd, Verified from Email where SSN=' + req.params.userId,
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
    }

    
  });
})
.post('/:userId', async (req, res, next) => {
  console.log('reqParams: ', req.params);
  console.log('key', req.body.key);

  await pool.getConnection( async (err, connection) => {
    if ( err ) {
      console.error("Something went wrong connecting to the database ...");
      throw err;
    }

    if ( req.query.key == 'EmailAdd' ) {
      await connection.query({
        sql: 'insert into Email (SSN, EmailAdd, Verified) values (?, ?, ?)',
        values: [req.body.SSN, req.body.EmailAdd, req.body.Verified],
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
  
        console.log('result: ', result.affectedRows);
        if ( result.affectedRows > 0 ) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, id: result.insertId});
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: false, id: null});
        }
        connection.release();
      });
    }
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
    } else if (req.body.key == 'EmailAdd') {
      await connection.query({
        sql: 'update ' + req.body.table + ' set ' + req.body.key + '="' + req.body.value + '" where id=' + req.params.userId,
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
    } else if (req.body.key == 'Verified') {
      await connection.query({
        sql: 'update ' + req.body.table + ' set ' + req.body.key + '="' + req.body.value + '" where id=' + req.params.userId,
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
})
.delete('/:userId', async (req, res, next) => {
  console.log('reqParams: ', req.params);
  console.log('key', req);
  await pool.getConnection( async (err, connection) => {
    if ( err ) {
      console.error("Something went wrong connecting to the database ...");
      throw err;
    }

    if (req.query.key == 'EmailAdd') {
      await connection.query({
        sql: 'delete from Email where id=' + req.params.userId,
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
        if ( result.affectedRows > 0 ) {
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

module.exports = router;
