'use strict';
var express = require('express');
var router = express.Router();
const mysql = require('mysql');
const pool = require('../pool');
const cors = require('../cors');

function isoToDate(date) {
    let temp = '';
    temp = date;
    let temp1 = temp.substring(0, temp.length - 15);
    let temp2 = temp.substring(temp.length - 13, temp.length - 1);
    let temp3 = temp1 + " " + temp2;
    // let temp3 = temp.slice(0, -1);
    console.log('temp3 ', temp3);
    return temp3;
}

// Get all Request Transactions
router.get('/', async (req, res, next) => {
    await pool.getConnection(async (err, connection) => {
        if ( err ) {
            console.error("Something went wrong connecting to the database ...");
            throw err;
        }
        // Get pending transactions
        if ( req.query.status === 'Partial' ) {
            // if ( req.query.Email1 != null && req.query.Email2 != null && req.query.Email3 != null) {
            //     connection.query({
            //         sql: 'select Request_Transaction.*, User_Account.Name, User_Account.PhoneNo from FROM1 join Request_Transaction on Request_Transaction.RTid=FROM1.RTid join User_Account on Request_Transaction.SSN = User_Account.SSN where FROM1.Identifier=? or FROM1.Identifier=? or FROM1.Identifier=? or FROM1.Identifier=?',
            //         values: [req.query.Email1, req.query.Email2, req.query.Email3, req.query.Phone],
            //         timeout: 60000
            //     }, (err1, result) => {
            //         if ( err1 ) {
            //             console.log('err1: ', err1);
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type', 'application/json');
            //             res.json({success: false, msg: 'error'});
            //             connection.release();
            //             throw err1;
            //         }

            //         console.log('result: ', result);
            //         let array = [];
            //         if ( result.length > 0 ) {
            //             // result.foreach((data) => {

            //             // })
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type', 'application/json');
            //             res.json({success: true, result: result});
            //         } else {
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type', 'application/json');
            //             res.json({success: false, result: []});
            //         }
            //     })
            // } else if ( req.query.Email1 != null && req.query.Email2 != null && req.query.Email3 == null) {
            //     connection.query({
            //         sql: 'select Request_Transaction.*, User_Account.Name, User_Account.PhoneNo from FROM1 join Request_Transaction on Request_Transaction.RTid=FROM1.RTid join User_Account on Request_Transaction.SSN = User_Account.SSN where FROM1.Identifier=? or FROM1.Identifier=? or FROM1.Identifier=?',
            //         values: [req.query.Email1, req.query.Email2, req.query.Phone],
            //         timeout: 60000
            //     }, (err1, result) => {
            //         if ( err1 ) {
            //             console.log('err1: ', err1);
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type', 'application/json');
            //             res.json({success: false, msg: 'error'});
            //             connection.release();
            //             throw err1;
            //         }

            //         console.log('result: ', result);
            //         let array = [];
            //         if ( result.length > 0 ) {
            //             // result.foreach((data) => {

            //             // })
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type', 'application/json');
            //             res.json({success: true, result: result});
            //         } else {
            //             res.statusCode = 200;
            //             res.setHeader('Content-Type', 'application/json');
            //             res.json({success: false, result: []});
            //         }
            //     });
            // } else
            if ( req.query.Email1 != null ) {
                connection.query({
                    sql: 'select Request_Transaction.*, User_Account.Name, User_Account.PhoneNo from FROM1 join Request_Transaction on Request_Transaction.RTid=FROM1.RTid join User_Account on Request_Transaction.SSN = User_Account.SSN where (FROM1.Identifier=? or FROM1.Identifier=?) and FROM1.Percentage=50.01',
                    values: [req.query.Email1, req.query.Phone],
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
                    let array = [];
                    if ( result.length > 0 ) {
                        // result.foreach((data) => {

                        // })
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, result: result});
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: false, result: []});
                    }
                });
            } else if (req.query.Email1 != null && req.query.Email2 == null && req.query.Email3 == null) {
                connection.query({
                    sql: 'select Request_Transaction.*, User_Account.Name, User_Account.PhoneNo from FROM1 join Request_Transaction on Request_Transaction.RTid=FROM1.RTid join User_Account on Request_Transaction.SSN = User_Account.SSN where FROM1.Identifier=? and FROM1.Percentage=50.01',
                    values: [req.query.Phone],
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
                    let array = [];
                    if ( result.length > 0 ) {
                        // result.foreach((data) => {

                        // })
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: true, result: result});
                    } else {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: false, result: []});
                    }
                });
            }
            
        } else if (req.query.status === 'monthlyExpense') {
            await pool.getConnection(async (err, connection) => {
                if ( err ) {
                    console.error("Something went wrong connecting to the database ...");
                    throw err;
                }

                await connection.query({
                    sql: 'select * from Monthly_Request_Transaction_Statements where SSN=' + req.query.SSN,
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
        }
    });
})
// Add new Request Transaction
.post('/', async (req, res, next) => {
    var date = new Date();
    console.log('date', date.toLocaleString());
    console.log('Identifier: ', req.body.Identifier);
    await pool.getConnection(async (err, connection) => {
        if ( err ) {
            console.error("Something went wrong connecting to the database ...");
            throw err;
        }

        await connection.query({
            sql: 'select * from Elec_Address where Identifier="' + req.body.Identifier + '"',
            timeout: 60000
        }, async (err1, elecRes) => {
            if ( err1 ) {
                console.log('err1: ', err1);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, msg: 'error'});
                connection.release();
                throw err1;
            }

            console.log('elecRes: ', elecRes);
            if ( elecRes.length > 0 ) {
                // Insert into request_transaction
                await connection.query({
                    sql: 'insert into Request_Transaction (Amount, Date_Time, Memo, SSN) values (?, ?, ?, ?)',
                    values: [req.body.Amount, date.toISOString(), req.body.Memo, req.body.SSN],
                    timeout: 60000 
                }, async (err2, reqTraRes) => {
                    if ( err2 ) {
                        console.log('err2: ', err2);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: false, msg: 'error'});
                        connection.release();
                        throw err2;
                    }

                    console.log('reqTraRes: ', reqTraRes);
                    if ( reqTraRes.affectedRows > 0 ) {
                        // get RTid from request transaction
                        await connection.query({
                            sql: 'select RTid from Request_Transaction where amount=' + req.body.Amount + ' and Date_Time=' + connection.escape(date.toISOString()) + '',
                            timeout: 60000
                        }, async (err3, getRtidRes) => {
                            if ( err3 ) {
                                console.log('err3: ', err3);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({success: false, msg: 'error'});
                                connection.release();
                                throw err3;
                            }

                            console.log('getRtidRes: ', getRtidRes);
                            if ( getRtidRes.length > 0 ) {
                                // insert int0 from1
                                let rtid = getRtidRes[0].RTid;
                                await connection.query({
                                    sql: 'insert into FROM1 (RTid,Identifier,Percentage) values (?, ?, ?)',
                                    values: [getRtidRes[0].RTid, req.body.Identifier, req.body.Percentage],
                                    timeout: 60000
                                }, async (err4, from1Res) => {
                                    if ( err4 ) {
                                        console.log('err4: ', err4);
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({success: false, msg: 'error'});
                                        connection.release();
                                        throw err4;
                                    }

                                    console.log('from1Res: ', from1Res);
                                    if ( from1Res.affectedRows > 0 ) {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({success: true, RTid: rtid});
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
                })
            } else {
                // Identifier doesn't exist create new account
            }
        });
    });
});

// if ( req.body.key === 'Phone' ) {
//     // Get Sender's Balance
//     await connection.query({
//         sql: 'select SSN, Balance from User_Account where PhoneNo=' + req.body.Identifier,
//         timeout: 60000
//     }, (err5, getSendBalRes) => {
//         if ( err5 ) {
//             console.log('err5: ', err5);
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json({success: false, msg: 'error'});
//             connection.release();
//             throw err5;
//         }

//         console.log('getSendBalRes: ', getSendBalRes);

//         if ( getSendBalRes.length > 0 ) {
//             let SSN = getSendBalRes[0].SSN;
//             let InitBalance = getSendBalRes[0].Balance;
//             // 
//         } else {
//             res.statusCode = 200;
//             res.setHeader('Content-Type', 'application/json');
//             res.json({success: false});
//         }
//     })
// }

//Update Balances and Request Transactions and From1
router.put('/:rtid', async (req, res, next) => {
    await pool.getConnection(async (err, connection) => {
        if ( err ) {
            console.error("Something went wrong connecting to the database ...");
            throw err;
        }
        // Get Receiver Balance
        await connection.query({
            sql: 'select SSN, Balance from User_Account where SSN=' + req.body.SSN,
            timeout: 60000
        }, async (err1, recRes) => {
            if ( err1 ) {
                console.log('err1: ', err1);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json({success: false, msg: 'error'});
                connection.release();
                throw err1;
            }

            console.log('recRes: ', recRes);
            if ( recRes.length > 0 ) {
                let recBal = +recRes[0].Balance;
                let recSSN = +recRes[0].SSN;
                // get sender balance
                await connection.query({
                    sql: 'select SSN, Balance from User_Account where SSN=' + (+req.body.key),
                    timeout: 60000
                }, async (err2, sendRes) => {
                    if ( err2 ) {
                        console.log('err2: ', err2);
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({success: false, msg: 'error'});
                        connection.release();
                        throw err2;
                    }

                    console.log('sendRes: ', sendRes);

                    if ( sendRes.length > 0 ) {
                        let sendSSN = 0;
                        sendSSN = +sendRes[0].SSN;
                        console.log('sendSSn', sendSSN);
                        let SendBal = 0.0;
                        SendBal = +sendRes[0].Balance;
                        let amount = 0.0;
                        amount = (+req.body.Amount);
                        recBal = recBal + amount;
                        SendBal = SendBal - amount;
                        console.log('balances ', SendBal, recBal);
                        await connection.query({
                            sql: ' update User_Account set Balance=' + SendBal + ' where SSN=' + sendSSN,
                            timeout: 60000
                        }, async (err3, updateSendBalRes) => {
                            if ( err3 ) {
                                console.log('err3: ', err3);
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json({success: false, msg: 'error'});
                                connection.release();
                                throw err3;
                            }

                            console.log('updateBalRes: ', updateSendBalRes);
                            if ( updateSendBalRes.affectedRows > 0 ) {
                                await connection.query({
                                    sql: 'update User_Account set Balance=' + recBal + ' where SSN=' + recSSN,
                                    timeout: 60000
                                }, async (err5, updateRecBalRes) => {
                                    if ( err5 ) {
                                        console.log('err5: ', err5);
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json({success: false, msg: 'error'});
                                        connection.release();
                                        throw err5;
                                    }

                                    console.log('updateRecBalRes: ', updateRecBalRes);
                                    if ( updateRecBalRes.affectedRows > 0 ) {
                                        // Update From1 table
                                        await connection.query({
                                            sql: 'update FROM1 set Percentage=99.99 where RTid=' + req.params.rtid,
                                            timeout: 60000
                                        }, (err4, from1Res) => {
                                            if ( err4 ) {
                                                console.log('err4: ', err4);
                                                res.statusCode = 200;
                                                res.setHeader('Content-Type', 'application/json');
                                                res.json({success: false, msg: 'error'});
                                                connection.release();
                                                throw err4;
                                            }
        
                                            console.log('from1Res: ', from1Res);
        
                                            if ( from1Res.affectedRows > 0 ) {
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
                        })
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
    });
})

module.exports = router;