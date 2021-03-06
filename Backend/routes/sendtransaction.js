'use strict';
var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const pool = require('../pool');
const cors = require('../cors');

// Get all Send Transactions
router.get('/', async function(req, res, next) {
    // res.send('respond with a resource');

    // Get All Send Transactions of a particular user Monthwise
    await pool.getConnection(async (err, connection) => {
        if ( err ) {
            console.error("Something went wrong connecting to the database ...");
            throw err;
        }

        await connection.query({
            sql: 'select * from Monthly_Send_Transaction_Statements where SSN=' + req.query.SSN,
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

            if ( result.length > 0 ) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: true, result: result});
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, result: []});
            }
        });
    });
})
// Add new Send Transaction
.post('/', async (req, res, next) => {
    var date = new Date();
    console.log('date', date);
    console.log('body', req.body);
    await pool.getConnection(async (err, connection) => {
        if ( err ) {
            console.error("Something went wrong connecting to the database ...");
            throw err;
        }

        await connection.query({
            sql: 'insert into Send_Transaction(Amount,Date_Time,Memo,SSN,Identifier) values (?,?,?,?,?)',
            values: [req.body.Amount, date, req.body.Memo, req.body.SSN, req.body.Identifier],
            timeout: 60000
        }, async (err1, STresult) => {
            if ( err1 ) {
                console.log('err1: ', err1);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, msg: 'error'});
                connection.release();
                throw err1;
            }

            console.log('STresult ', STresult.affectedRows);
            if ( STresult.affectedRows > 0 ) {
                const numRegex = /^[0-9]+$/;
                const emailRegex = /^([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\.([a-zA-Z]{2,5})$/;
                let identifier = '';
                identifier = req.body.Identifier;
                
                if ( identifier.match(numRegex) ) {
                    console.log('yo');
                    let phoneNo = +identifier;
                    // Get Recipient's amount
                    await connection.query({
                        sql: 'select SSN, Balance from User_Account where PhoneNo=' + phoneNo,
                        timeout: 60000 
                    }, async (err2, recUserAccRes) => {
                        if ( err2 ) {
                            console.log('err2: ', err2);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({success: false, msg: 'error'});
                            connection.release();
                            throw err2;
                        }

                        console.log('recUserAccRes: ', recUserAccRes);
                        if ( recUserAccRes.length > 0 ) {
                            // update reciever balance
                            let balance = +(recUserAccRes[0].Balance + req.body.Amount);
                            let recSSN = recUserAccRes[0].SSN;
                            await connection.query({
                                sql: 'update User_Account set Balance=' + balance + ' where SSN=' + recSSN,
                                timeout: 60000
                            }, async (err3, recBalUpRes) => {
                                if ( err3 ) {
                                    console.log('err3: ', err3);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({success: false, msg: 'error'});
                                    connection.release();
                                    throw err3;
                                }
                                console.log('recBalUpRes: ', recBalUpRes);
                                if ( recBalUpRes.affectedRows > 0 ) {
                                    let senderBalance = +(req.body.Balance - req.body.Amount);
                                    // update sender Balance
                                    await connection.query({
                                        sql: 'update User_Account set Balance=' + senderBalance + ' where SSN=' + req.body.SSN,
                                        timeout: 60000
                                    }, (err4, sendBalUpRes) => {
                                        if ( err4 ) {
                                            console.log('err4: ', err4);
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json({success: false, msg: 'error'});
                                            connection.release();
                                            throw err4;
                                        }
                                        console.log('sendBalUpRes: ', sendBalUpRes);
                                        if ( sendBalUpRes.affectedRows > 0 ) {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json({success: true});
                                        } else {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json({success: false});
                                        }
                                    });
                                } else {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({success: false});
                                }
                            });
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({success: false});
                        }
                    });
                } else {
                    console.log('nah');
                    let email = req.body.Identifier;
                    // Ger Recepients amount
                    await connection.query({
                        sql: 'select Email.SSN, User_Account.Balance from Email join User_Account on Email.SSN = User_Account.SSN where Email.EmailAdd="' + req.body.Identifier + '"',
                        timeout: 60000
                    }, async (err3, recRes) => {
                        if ( err3 ) {
                            console.log('err3: ', err3);
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({success: false, msg: 'error'});
                            connection.release();
                            throw err3;
                        }
                        console.log('recRes: ', recRes);
                        if ( recRes.length > 0 ) {
                            // Update Recipient Balance
                            let recBal = 0.00;
                            recBal = recRes[0].Balance;
                            let recSSN = 0;
                            recSSN = recRes[0].SSN;
                            let recAmount = 0.00;
                            recAmount = recBal + (+req.body.Amount);
                            await connection.query({
                                sql: 'update User_Account set Balance=' + recAmount + ' where SSN=' + recSSN,
                                timeout: 60000
                            }, async (err4, recBalUpRes) => {
                                if ( err4 ) {
                                    console.log('err4: ', err4);
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({success: false, msg: 'error'});
                                    connection.release();
                                    throw err4;
                                }
                                console.log('recBalUpRes: ', recBalUpRes);
                                if ( recBalUpRes.affectedRows > 0 ) {
                                    // Update sender balance
                                    let sendAmount = 0.00;
                                    sendAmount = +req.body.Balance - +req.body.Amount;
                                    await connection.query({
                                        sql: 'update User_Account set Balance=' + sendAmount + ' where SSN=' + req.body.SSN,
                                        timeout: 60000
                                    }, (err5, sendBalUpRes) => {
                                        if ( err5 ) {
                                            console.log('err5: ', err5);
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json({success: false, msg: 'error'});
                                            connection.release();
                                            throw err5;
                                        }
                                        console.log('sendBalUpRes: ', sendBalUpRes);
                                        if ( sendBalUpRes.affectedRows > 0 ) {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json({success: true});
                                        } else {
                                            res.statusCode = 200;
                                            res.setHeader('Content-Type', 'application/json');
                                            res.json({success: false});
                                        }
                                    })
                                } else {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json({success: false});
                                }
                            })
                        } else {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json({success: false});
                        }
                    });
                }
            } else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false});
            }
        });
    });
});

module.exports = router;