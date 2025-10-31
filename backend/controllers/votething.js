const { validationResult } = require('express-validator');

const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

const Votething = require('../models/votething');

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cbcpb_general_db.db", sqlite3.OPEN_READWRITE, (err)=>{
    if (err) {
        console.log("errpr db = "+err);
        return console.error(err); 
    }
    else{
        console.log('Connected to sqlite database in votething');
    }
});

exports.fetchVoteExist = async (req, res, next) => {
    try{
        var sql = 'SELECT count(*) as result from votes_users';
        if((req.body.idUser != null && req.body.idUser !=undefined && req.body.idUser != 0) && (req.body.idThing != null && req.body.idThing !=undefined && req.body.idThing != 0) ){
            sql = sql + ' where idUser=' + req.body.idUser + ' and idThing=' + req.body.idThing;
        }
        else{
            return res.status(200).json({message:"serverError"});
        }
        console.log("fetchCountAll sql = "+sql);
        return db.all(sql, (err, row) => {
                console.log("sql try fetchVoteExist");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json(errString);
                } else {
                    console.log("no error sql try fetchVoteExist");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("votes not undefined");
                        console.log("votes = "+JSON.stringify(row));
                        return res.status(200).json(row);
                    }
                    else{
                        console.log("serverError line 176");
                        return res.status(200).json({message:"serverError"});
                    }
                }
        });
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchVoteThings = async (req, res, next) => {
    try{
        /**
         * idThing, idCountry, idContinent, cb, cpb, name, nameFr
         */
        console.log("idThing = "+req.body.idThing);
        console.log("idCountry = "+req.body.idCountry);
        console.log("idContinent = "+req.body.idContinent);
        console.log("cb = "+req.body.cb);
        console.log("cpb = "+req.body.cpb);
        console.log("name = "+req.body.name);
        console.log("nameFr = "+req.body.nameFr);
        var sql = 'INSERT INTO vote_things(idThing, idCountry, idContinent, cb, cpb, name, nameFr) VALUES (';
        if((req.body.idThing != null && req.body.idThing !=undefined && req.body.idThing != 0) 
            && (req.body.idCountry != null && req.body.idCountry !=undefined && req.body.idCountry != 0)
            && (req.body.idContinent != null && req.body.idContinent !=undefined && req.body.idContinent != 0)
            && (req.body.cb != null && req.body.cb !=undefined && req.body.cpb != null && req.body.cpb !=undefined)
            && ((req.body.cb ==1 && req.body.cpb ==0)||(req.body.cb ==0 && req.body.cpb ==1))
            && (req.body.name != null && req.body.name !=undefined)
            && (req.body.nameFr != null && req.body.nameFr !=undefined)
            ){
            sql = sql + req.body.idThing +','+req.body.idCountry+','+req.body.idContinent+','+req.body.cb+','+req.body.cpb+',"'+req.body.name+'","'+req.body.nameFr+'")';
        }
        else{
            return res.status(200).json({message:"serverError"});
        }

        console.log("sql fetchVoteCbCpb = "+sql);
        return db.all(sql, (err, row) => {
                console.log("sql try insert vote into vote_things");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json({message:errString});
                } else {
                    console.log("no error sql try fetchVoteCbCpb");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("votes not undefined");
                        console.log("votes = "+JSON.stringify(row));
                        return res.status(200).json({message:"success"});
                    }
                    else{
                        console.log("serverError line 176");
                        return res.status(200).json({message:"serverError"});
                    }
                }
        });
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchVotesUsers = async (req, res, next) => {
    try{
        var sql = 'INSERT INTO votes_users(idUser, idThing) VALUES (';
        if((req.body.idUser != null && req.body.idUser !=undefined && req.body.idUser != 0) && (req.body.idThing != null && req.body.idThing !=undefined && req.body.idThing != 0) ){
            sql = sql + req.body.idUser + ',' + req.body.idThing+')';
        }
        else{
            return res.status(200).json({message:"serverError"});
        }

        console.log("sql fetchVotesUsersCbCpb = "+sql);
        return db.all(sql, (err, row) => {
                console.log("sql try insert vote into votes_users");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json({message:errString});
                } else {
                    console.log("no error sql try fetchVotesUsersCbCpb");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("votes not undefined");
                        console.log("votes = "+JSON.stringify(row));
                        return res.status(200).json({message:"success"});
                    }
                    else{
                        console.log("serverError line 176");
                        return res.status(200).json({message:"serverError"});
                    }
                }
        });
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchVoteUpdateThing = async (req, res, next) => {
    console.log("fetchVoteUpdateThing");
    try{
        console.log("idThing = "+req.body.idThing);
        console.log("cb = "+req.body.cb);
        console.log("cpb = "+req.body.cpb);
        var sql = 'UPDATE things SET ';
        if((req.body.idThing != null && req.body.idThing !=undefined && req.body.idThing != 0)
            && (req.body.cb != null && req.body.cb !=undefined )
            && (req.body.cpb != null && req.body.cpb !=undefined )){
            sql = sql + 'cb='+req.body.cb+', cpb='+req.body.cpb+' WHERE id='+req.body.idThing;
        }
        else{
            return res.status(200).json({message:"serverError"});
        }

        console.log("sql fetchVoteUpdateThing = "+sql);
        return db.all(sql, (err, row) => {
                console.log("sql try to update thing");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json({message:errString});
                } else {
                    console.log("no error sql try fetchVoteUpdateThing");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("result = "+JSON.stringify(row));
                        return res.status(200).json({message:"success"});
                    }
                    else{
                        console.log("serverError line 176");
                        return res.status(200).json({message:"serverError"});
                    }
                }
        });
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

