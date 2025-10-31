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
        console.log('Connected to sqlite database in typething');
    }
});

exports.fetchAll = async (req, res, next) => {
    console.log("fetchAll Type");
    try{
        console.log("fetchAll id = "+req.body.language);
        
        var sql = 'SELECT * FROM things_type order by id';

        if(req.body.language !=""){
            let language = req.body.language;
            let fieldName = "name";
            if (language == "en"){
                fieldName = "name";
            }
            else if (language == "fr"){
                fieldName = "name_fr";
            }
            sql = 'SELECT * FROM things_type order by '+fieldName;

            /*console.log("value = "+req.body.value);
            if(req.body.value !=""){
                sql = 'SELECT * FROM things_type where idUser='+fieldName+' like "'+req.body.value+'%" order by '+fieldName;
            }*/
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
                        console.log("alltypethings not null and alltypeThing not undefined");
                        console.log("alltypethings = "+JSON.stringify(row));
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
