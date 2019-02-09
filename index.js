"use strict";
require('dotenv').config();

var db = require('./api/mysql');

//Get list of all active coins with current price as a join
db.query('SELECT calls_list.pair,calls_list.exchange,calls_list.target1,calls_list.target2,calls_list.target3,calls_list.stop_loss,calls_list.type,calls_list.user,calls_list.hit1,calls_list.hit2,calls_list.hit3,coinData.price FROM calls_list left join coinData on (calls_list.pair = coinData.pair AND calls_list.exchange = coinData.exchange) where coinData.timeFrame = ? and calls_list.status=?', ['1d','open'],function(err,result,fields){
  if (err) throw err;

  for(var key in result){
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

    //If coin is less than stoploss update status - close / fail - update close_date NOW()
    if(price < stop_loss){
      console.log('close / fail');
    }

    //Check target 1
    //If target 1 hit, update hit1 - yes and check target 2
    //If target 2 hit, update hit2 - yes and check target 3
    //If target 3 hit, update hit 3 - yes and update status - close/hit update close_date NOW()
    if(hit1 == 'no'){
      if(target1 => price){
        console.log('hit target 1');
      }

      if(target2 => price){
        console.log('hit target 2');
      }

      if(target3 => price){
        console.log('hit target 2');
      }
    } else if (hit1 == 'yes'){
      if(target2 => price){
        console.log('hit target 2');
      }

      if(target3 => price){
        console.log('hit target 2');
      }
    } else if (hit2 == 'yes'){
      if(target3 => price){
        console.log('hit target 2');
      }
    }

  }
}); //End DB query
