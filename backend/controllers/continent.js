const { validationResult } = require('express-validator');

const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

const Continent = require('../models/continent');

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cbcpb_general_db.db", sqlite3.OPEN_READWRITE, (err)=>{
    if (err) {
        console.log("errpr db = "+err);
        return console.error(err); 
    }
    else{
        console.log('Connected to sqlite database in continent');
    }
});

exports.fetchAll = async (req, res, next) => {
	console.log("call fetchall continent");
	try{
        var where = "";
		var sql = 'SELECT u.id, u.name, u.namefr, u.image, u.lowercase_name, u.lowercase_nameFr, coalesce(sum(p.cb),0) as total_cb, coalesce(sum(p.cpb), 0) as total_cpb FROM continents u LEFT JOIN vote_things p ON u.id = p.idContinent';
		console.log("req.query.idThing = "+req.body.idThing);
        if(req.body.idThing != undefined ){
			where = " WHERE p.idThing = "+req.body.idThing;
			sql = sql + where
		}

		if (req.body.lang === "en"){
            groupBy = ' GROUP BY u.name';
			sql = sql + groupBy;
            console.log("sql final continent en = "+sql);
            return db.all(sql),(err, result)=>{
                if (err){
                    console.log("err = "+err);
					if (!err.statusCode){
						err.statusCode = 500;
					}
                    return res.status(err.statusCode).json(result);
                }
                else{
                    res.status(200).json(result);
                }
            }
        }
        else{
            groupBy = ' GROUP BY u.namefr';
			sql = sql + groupBy;
            console.log("sql final continent fr = "+sql);
            return db.all(sql,(err, result)=>{
                if (err){
                    console.log("err = "+err);
					if (!err.statusCode){
						err.statusCode = 500;
					}
                    return res.status(err.statusCode).json(result);
                }
                else{
                    res.status(200).json(result);
                }
             }
         )
        }
    }catch(err){
        // 
		console.log("allContinent error = "+err);
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}