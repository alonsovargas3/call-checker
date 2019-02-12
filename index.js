//This file checks current calls to see if they have hit
//targets or stop loss. Only active targets are checked.
//All other calls remain in the database.
"use strict";
require('dotenv').config();

var db = require('./api/mysql');

//Get list of all active coins with current price as a join
db.query('SELECT \
            calls_list.ID,\
            calls_list.pair,\
            calls_list.exchange,\
            calls_list.target1,\
            calls_list.target2,\
            calls_list.target3,\
            calls_list.stop_loss,\
            calls_list.type,\
            calls_list.user,\
            calls_list.hit1,\
            calls_list.hit2,\
            calls_list.hit3,\
            coinData.price\
          FROM \
            calls_list \
                LEFT JOIN \
            coinData ON (calls_list.pair = coinData.pair \
                AND calls_list.exchange = coinData.exchange) \
          WHERE \
            coinData.timeFrame = ? \
            AND calls_list.status = ?', ['1d','open'],function(err,result,fields){
  if (err) throw err;

  for(var key in result){
    var rowID = result[key].ID;
    var pair = result[key].pair;
    var exchange = result[key].exchange;
    var target1 = result[key].target1;
    var target2 = result[key].target2;
    var target3 = result[key].target3;
    var stop_loss = result[key].stop_loss;
    var type = result[key].type;
    var user = result[key].user;
    var hit1 = result[key].hit1;
    var hit2 = result[key].hit2;
    var hit3 = result[key].hit3;
    var price = result[key].price;

    //console.log(price);
    console.log("Checking call by " + user + " for " + pair); 

    //If coin is less than stoploss update status - close / fail - update close_date NOW()
    if(price < stop_loss){
      console.log('Stop Loss hit - Closed with Fail');
      db.query('UPDATE calls_list SET status = ?, status_detail = ?, close_date = NOW() WHERE ID = ?', ['closed','fail',rowID],function(err,result,fields){
        if (err) throw err;
      }); //End DB query
    } else {
      //Check target 1
      //If target 1 hit, update hit1 - yes and check target 2
      //If target 2 hit, update hit2 - yes and check target 3
      //If target 3 hit, update hit 3 - yes and update status - close/hit update close_date NOW()
      console.log("Current price = " + price);
      if(hit1 == 'no'){
        if(price >= target1){
          console.log(pair + ' hit target 1 of ' + target1);
          //update DB with hit1 = yes
          db.query('UPDATE calls_list SET hit1 = ? WHERE ID = ?', ['yes',rowID],function(err,result,fields){
            if (err) throw err;
          }); //End DB query
        } else {
          console.log(pair + ' did not hit target 1 of ' + target1);
        }

        if(price >= target2){
          console.log(pair + ' hit target 2 of ' + target2);
          //update DB with hit2 = yes
          db.query('UPDATE calls_list SET hit2 = ? WHERE ID = ?', ['yes',rowID],function(err,result,fields){
            if (err) throw err;
          }); //End DB query
        } else {
          console.log(pair + ' did not hit target 2 of ' + target2);
        }

        if(price >= target3){
          console.log(pair + ' hit target 3 of ' + target3);
          //update DB with hit3 = yes
          db.query('UPDATE calls_list SET hit3 = ?, status = ?, status_detail = ?, close_date = NOW() WHERE ID = ?', ['yes','closed','win',rowID],function(err,result,fields){
            if (err) throw err;
          }); //End DB query
        } else {
          console.log(pair + ' did not hit target 3 of ' + target3);
        }
      } else if (hit1 == 'yes'){
        if(price >= target2){
          console.log(pair + ' hit target 2 of ' + target2);
          //update DB with hit2 = yes
          db.query('UPDATE calls_list SET hit2 = ? WHERE ID = ?', ['yes',rowID],function(err,result,fields){
            if (err) throw err;
          }); //End DB query
        }else {
          console.log(pair + ' did not hit target 2 of ' + target2);
        }

        if(price >= target3){
          console.log(pair + ' hit target 3 of ' + target3);
          //update DB with hit3 = yes
          db.query('UPDATE calls_list SET hit3 = ?, status = ?, status_detail = ?, close_date = NOW() WHERE ID = ?', ['yes','closed','win',rowID],function(err,result,fields){
            if (err) throw err;
          }); //End DB query
        } else {
          console.log(pair + ' did not hit target 3 of ' + target3);
        }
      } else if (hit2 == 'yes'){
        if(price >= target3){
          console.log(pair + ' hit target 3 of ' + target3);
          //update DB with hit2 = yes
          db.query('UPDATE calls_list SET hit3 = ?, status = ?, status_detail = ?, close_date = NOW() WHERE ID = ?', ['yes','closed','win',rowID],function(err,result,fields){
            if (err) throw err;
          }); //End DB query
        }else {
          console.log(pair + ' did not hit target 3 of ' + target3);
        }
      }
    }

  }
}); //End DB query
