const { validationResult } = require('express-validator');

const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

const Thing = require('../models/thing');

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cbcpb_general_db.db", sqlite3.OPEN_READWRITE, (err)=>{
    if (err) {
        console.log("errpr db = "+err);
        return console.error(err); 
    }
    else{
        console.log('Connected to sqlite database in thing');
    }
});

exports.postThing = async (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return;

    const name = req.body.name;
    const description = req.body.description;
    const user = req.body.user;

    try {
        
        const thing = {
            name: name,
            description: description,
            user: user
        }

        const result = await Thing.save(thing);
        res.status(201).json({ message: 'Posted!' });
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchAll = async (req, res, next) => {
    console.log("fetchAll");
    try{
        
        var sql = 'SELECT * FROM things order by id';

        if(req.body.language !=""){
            let language = req.body.language;
            let fieldName = "name";
            if (language == "en"){
                fieldName = "name";
            }
            else if (language == "fr"){
                fieldName = "name_fr";
            }
            sql = 'SELECT * FROM things order by '+fieldName;

            if(req.body.value !=""){
                sql = 'SELECT * FROM things where idUser='+fieldName+' like "'+req.body.value+'%" order by '+fieldName;
            }
        }

        return db.all(sql, (err, row) => {
                console.log("sql try fetchAll");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json(errString);
                } else {
                    console.log("no error sql try fetchAll");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("allthings not null and allThing not undefined");
                        console.log("allthings = "+JSON.stringify(row));
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

exports.fetchCountAll = async (req, res, next) => {
    console.log("fetchCountAll");
    try{
        var sql = 'SELECT count(*) as thingsTotal FROM things';
        var thingsTypeId =req.body.thingsTypeId;
        var statut = req.body.statut;
        var userId = req.body.userId;
        var language = req.body.language;
        var searchThingInList = req.body.searchThingInList;
        var and = " and ";
        var where = "";
        var nameOnTable = "";

        if(thingsTypeId != null && thingsTypeId !=undefined && thingsTypeId != 0){
            where = ' where things_type_id='+thingsTypeId;
        }

        if (statut !== ""){
            if (where != ""){
                where = where + and + " " + statut;
            }
            else{
                where = " where " + statut;
            }
        }
        
        if (userId != null && userId != undefined){
            if (where == ""){
                where = " where idUser="+req.body.userId;
            }
            else {
                where = where + " and idUser="+req.body.userId;
            }
        }

        if (language != null && language != undefined && language != ""){
            if(language == "fr"){
                nameOnTable = "name_fr";
            }
            else if (language == "en"){
                nameOnTable = "name";
            }
            else{
                nameOnTable = "name";
            }
        }
        else{
            nameOnTable = "name";
        }

        if( searchThingInList != null && searchThingInList != undefined && searchThingInList != ""){
            if (where != ""){
                where = where  + " and " + nameOnTable + " like '%" + searchThingInList + "%'";
            }
            else{
                where = where + " where "+ nameOnTable + " like '%" + searchThingInList + "%'";
            }
        }
        
        sql+=where;
        console.log("fetchCountAll sql = "+sql);

        return db.all(sql, (err, row) => {
                console.log("sql try fetchCountAllTen");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json(errString);
                } else {
                    console.log("no error sql try fetchAllGeneralPersonal");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("allthings count not null and allThing not undefined");
                        console.log("allthings count = "+JSON.stringify(row));
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

exports.fetchAllTen = async (req, res, next) => {
    console.log("fetchAllTen");
    try{
        var sql = 'SELECT * FROM things';

        //Check where to use
        var where = "";
        var things_type_id = req.body.value;
        var and = " and ";
        var order = "";
        var statut = req.body.statut;
        var idUser = req.body.userId;
        var currentPage = req.body.currentPage;
        var searchThingInList = req.body.searchThingInList;
        var language = req.body.language;

        console.log("things_type_id = " +things_type_id);
        console.log("and = " +and);
        console.log("order = " +order);
        console.log("statut = " +statut);
        console.log("idUser = " +idUser);
        console.log("currentPage = " +currentPage);
        console.log("searchThingInList = " +searchThingInList);
        console.log("language = " +language);

        var nameOnTable = "";
        
        if(things_type_id !="0"){
            where = " where things_type_id=" + things_type_id;
        }

        if (statut !== ""){
            if (where != ""){
                where = where + and + " " + statut;
            }
            else{
                where = " where " + statut;
            }
        }

        if (currentPage !== "0"){
            let beginId = ((currentPage-1) * 10);
            let lastId = 10;
            order = ' order by id desc limit '+beginId+', '+lastId;
        }

        if( idUser != null && idUser != undefined && idUser != ""){
            if (where != ""){
                where = where + and + " idUser=" + idUser;
            }
            else{
                where = " where idUser=" + idUser;
            }
        }

        if (language != null && language != undefined && language != ""){
            if(language == "fr"){
                nameOnTable = "name_fr";
            }
            else if (language == "en"){
                nameOnTable = "name";
            }
            else{
                nameOnTable = "name";
            }
        }
        else{
            nameOnTable = "name";
        }

        if( searchThingInList != null && searchThingInList != undefined && searchThingInList != ""){
            if (where != ""){
                where = where + and + " " + nameOnTable + " like '%" + searchThingInList + "%'";
            }
            else{
                where = " where "+ nameOnTable + " like '%" + searchThingInList + "%'";
            }
        }

        if(order == ""){
            order = ' order by id desc limit 10';
        }

        sql+=where+order;

        console.log("sql played fetchAllTen = "+sql);

        return db.all(sql, (err, row) => {
                console.log("sql try fetchAllTen");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json(errString);
                } else {
                    console.log("no error sql try fetchAllGeneralPersonal");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("allthings not null and allThing not undefined");
                        console.log("allthings = "+JSON.stringify(row));
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


exports.fetchAllGood = async (req, res, next) => {
    try{
        const [allThings] = await Thing.fetchAllGood();
        res.status(200).json(allThings);
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchAllGoodTen = async (req, res, next) => {
    console.log("fetchAllGoodTen");
    try{
        var sql = 'SELECT * FROM things WHERE cb>cpb order by id desc limit 10';
        console.log("value = "+req.body.value);
        if(req.body.value !== "0"){
            sql = 'SELECT * FROM things WHERE cb>cpb and things_type_id='+req.body.value+' order by id desc limit 10';
        }
        return db.all(sql, (err, row) => {
                console.log("sql try fetchAllGoodTen");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json(errString);
                } else {
                    console.log("no error sql try fetchAllGoodTen");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("allthings not null and allThing not undefined");
                        console.log("allthings = "+JSON.stringify(row));
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
        console.log("error in sql method fetAllGoodTen");
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchAllNotGoodTen = async (req, res, next) => {
    console.log("fetchAllNotGoodTen");
    try{
        var sql = 'SELECT * FROM things WHERE cpb>cb order by id desc limit 10';
        console.log("value = "+req.body.value);
        if(req.body.value !== "0"){
            sql = 'SELECT * FROM things WHERE cpb>cb and things_type_id='+req.body.value+' order by id desc limit 10';
        }
        return db.all(sql, (err, row) => {
                console.log("sql try fetchAllNotGoodTen");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json(errString);
                } else {
                    console.log("no error sql try fetchAllNotGoodTen");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("allthings not null and allThing not undefined");
                        console.log("allthings = "+JSON.stringify(row));
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
        console.log("error in sql method fetAllNotGoodTen");
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchAllEqualTen = async (req, res, next) => {
    console.log("fetchAllEqualTen");
    try{
        var sql = 'SELECT * FROM things where cb == cpb order by id desc limit 10';
        console.log("value = "+req.body.value);
        if(req.body.value !== "0"){
            sql = 'SELECT * FROM things WHERE cb == cpb and things_type_id='+req.body.value+' order by id desc limit 10';
        }
        return db.all(sql, (err, row) => {
                console.log("sql try fetchAllEqual");
                if (err) {
                    const errString = err.toString();
                    return res.status(200).json(errString);
                } else {
                    if(row!= null && row!= undefined){
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


exports.fetchAllGeneralPersonal = async (req, res, next) => {
    console.log("fetchAllGeneralPersonal");
    try{
        console.log("fetchAllGeneralPersonal id = "+req.body.userId);
        //change here to have all things
        if (req.body.userId==null){
            const error = new Error('Not authenticated!');
            error.statusCode = 401;
            throw error;
        }

        var sql = 'SELECT * FROM things where idUser='+req.body.userId+'order by id';

        if(req.body.language !=""){
            let language = req.body.language;
            let fieldName = "name";
            if (language == "en"){
                fieldName = "name";
            }
            else if (language == "fr"){
                fieldName = "name_fr";
            }
            sql = 'SELECT * FROM things where idUser='+req.body.userId+' order by '+fieldName;

            console.log("value = "+req.body.value);
            if(req.body.value !=""){
                sql = 'SELECT * FROM things where idUser='+req.body.userId+' and '+fieldName+' like "'+req.body.value+'%" order by '+fieldName;
            }
        }

        console.log("last sql = "+sql);
        return db.all(sql, (err, row) => {
                console.log("sql try fetchAllGeneralPersonal");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json(errString);
                } else {
                    console.log("no error sql try fetchAllGeneralPersonal");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("allthings not null and allThing not undefined");
                        console.log("allthings = "+JSON.stringify(row));
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

exports.deleteThing = async (req, res, next) => {
    try{
        const deleteResponse = await Thing.delete(req.params.id);
        res.status(200).json(deleteResponse);
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.fetchThingWithId = async (req, res, next) => {
   try{
        
        var sql = 'SELECT * FROM things ';

        let idThing = req.body.idThing;
        if(idThing !=undefined){
            sql = sql + "where id = "+idThing;
        }
        else{
            console.log("idThing null");
            return res.status(200).json({message:"serverError"});
        }

        console.log("sql fetchThingWithId = "+sql);
        return db.all(sql, (err, row) => {
                console.log("sql try fetchAll");
                if (err) {
                    const errString = err.toString();
                    console.log("error found ="+errString);
                    return res.status(200).json(errString);
                } else {
                    console.log("no error sql try fetchAll");
                    console.log("row = "+row);
                    if(row!= null && row!= undefined){
                        console.log("fetchThingWithId not null and allThing not undefined");
                        console.log("fetchThingWithId = "+JSON.stringify(row));
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