const { validationResult } = require('express-validator');

const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cbcpb_general_db.db", sqlite3.OPEN_READWRITE, (err)=>{
    if (err) {
        console.log("errpr db = "+err);
        return console.error(err); 
    }
    else{
        console.log('Connected to sqlite database in auth');
    }
});

var nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

exports.signup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const idCountry = req.body.idCountry ? req.body.idCountry : 0;
    const codeActivation = Math.floor(Math.random()*90000) + 10000;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            name: name,
            email: email,
            password: hashedPassword,
            idCountry: idCountry,
            codeActivation: codeActivation
        }
        
        var sql = 'INSERT INTO users (name, password, idCountry, codeActivation, email) VALUES (upper("'+String(userDetails.name)+'"),"'+String(userDetails.password)+'",'+String(userDetails.idCountry)+','+userDetails.codeActivation+',upper("'+String(userDetails.email)+'"))';
        return db.run(sql ,(err, result)=>{
                if (err){
                    const errString = err.toString();
                    return res.status(200).json(errString);
                }
                else{
                    res.status(200).json(result);
                }
            }
        )
    }catch(err){
        // handle
        console.log("error returned = "+err);
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.admin = async (req, res, next) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    try {
        const user =  await User.findAdmin(username);

        if (user[0].length !== 1){
            const error = new Error("userNotFound");
            error.statusCode = 401;
            throw error;
        }

        const storedAdminUser = user[0][0];
        const isEqual = await bcrypt.compare(password, storedAdminUser.authentication_string);

        if (!isEqual){
            const error = new Error("password");
            error.statusCode = 401;
            throw error;
        }

        const userCbcpb =  await User.find(email);
        const storedUser = user[0][0];

        const token = jwt.sign(
            {
                email: userCbcpb.email,
                userId: userCbcpb.id
            },
            'secretAdminfortoken',
            { expiresIn: '30000' }
        );

        res.status(200).json({ token: token, userId: storedUser.id});
    }catch (err) {
        if (!err.statusCode){
            err.statusCode  = 500;
        }
        next(err);
    }
}

exports.changeCodeActivation = async (req, res, next) => {
    const email = req.body.email;
    const newCodeActivation = Math.floor(Math.random()*90000) + 10000;
    try {
        var emailUpper = String(email).toUpperCase();
        var codeactivationNumber = Number(newCodeActivation);
        var sql = 'UPDATE users set codeActivation = '+codeactivationNumber+' WHERE email="'+emailUpper+'"';
        return db.run(sql, (err, result) => {
                if (err){
                    const errString = err.toString();
                    return res.status(200).json(errString);
                }
                else{
                    res.status(200).json("successChangeCodeActivation");
                }
        });
    }
    catch(err){
        // handle
        console.log("error returned = "+err);
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    
    try {
        var emailUpper = String(email).toUpperCase();
        var sql = 'SELECT * FROM users WHERE email = "'+emailUpper+'"';
        const user_found = await new Promise(resolve => {
            db.get(sql, (err, row) => {
                if (err) {
                    console.log("error message login = "+err.message);
                    resolve({ error : err.message});
                } else {
                    if(row != undefined && row != null){
                        resolve(row);
                    }
                    else{
                        resolve({ error :"Email not exist"});
                    }
                }
            });
        });
        if(user_found != null && user_found!= undefined && user_found.password != undefined){
            var user_found_password = user_found.password;
            const compare_password = await bcrypt.compare(password, user_found_password);
            return res.status(200).json(compare_password);
        }
        else if(user_found != null && user_found!= undefined && user_found.password == undefined){
            if(user_found.error != null){
                if(user_found.error == "Email not exist"){
                    return res.status(200).json("userNotFound");
                }
                else{
                    return res.status(200).json("serverError");
                }
            }
            else{
                return res.status(200).json("noPassword");
            }
        }
        else{
            return res.status(200).json("serverError");
        }
    }catch(err){
        // handle
        console.log("error returned = "+err);
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.checkuserinfos = async (req, res, next) => {
    console.log("getuserinfos req token = "+req.body.token);
    console.log("getuserinfos req email = "+req.body.userEmail);
    console.log("getuserinfos req userId = "+req.body.userId);
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        console.log("errorFormatter");
        return `${location}[${param}]: ${msg}`;
    };

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        console.log("errors empty");
        // Response will contain something like
        // { errors: [ "body[password]: must be at least 10 chars long" ] }
         return res.status(200).json({ email: req.body.userEmail, id: req.body.userId, message: "error", errors: errors.array()/*, canprivate: canprivate.canprivate*/});
    }

    if (req.body.userId==null || req.body.userEmail==null){
        console.log("not authenticated req.userId and req.email");
        return res.status(200).json({ email: req.body.userEmail, id: req.body.userId, message: "error"/*, canprivate: canprivate.canprivate*/});
    }
    else{
        console.log("checkuserinfos try sql");
        //const getname = await User.getname(req.body.userId);
        //const getprivate = await User.canprivate(req.userId);

        //const username = getname[0][0];
        //console.log("username = "+username);
        //const canprivate = getprivate[0][0];

        try {
            var sql = 'SELECT * FROM users WHERE user_id = '+req.body.userId+' and email = "'+req.body.userEmail+'"';
            console.log("sql in checkuserinfos = "+sql);
            const user_found = await new Promise(resolve => {
                console.log("try sql checkuserinfos");
                db.get(sql, (err, row) => {
                    if (err) {
                        console.log("error message get user = "+err.message);
                        resolve({ error : err.message});
                    } else {
                        if(row != undefined && row != null){
                            console.log("resolve row");
                            resolve(row);
                        }
                        else{
                            console.log("Email not exist");
                            resolve({ error :"Email not exist"});
                        }
                    }
                });
            });

            if(user_found != null && user_found!= undefined){
                console.log("userfound not null and userfound not undefined");
                console.log("user_found = "+JSON.stringify(user_found));
                console.log("user_found email = "+user_found.email);
                console.log("user_found name = "+user_found.name);
                res.status(200).json({ email: user_found.email, name: user_found.name, message: "success"/*, canprivate: canprivate.canprivate*/});
            }
            else if(user_found != null && user_found!= undefined && user_found.password == undefined){
                console.log("user_found = "+JSON.stringify(user_found));
                console.log("user_found password = "+user_found.password);
                if(user_found.error != null){
                    console.log("user_found error exist = "+user_found.error);
                    if(user_found.error == "Email not exist"){
                        return res.status(200).json({message:"userNotFound"});
                    }
                    else{
                        console.log("serverError line 252");
                        return res.status(200).json("serverError");
                    }
                }
                else{
                    console.log("no password");
                    return res.status(200).json({message:"noPassword"});
                }
            }
            else{
                console.log("serverError line 261");
                return res.status(200).json({message:"serverError"});
            }
        }catch(err){
            // handle
            if (!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        }
    }
}

exports.checkcode = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const code = String(req.body.numCode1)+String(req.body.numCode2)+ +String(req.body.numCode3)+String(req.body.numCode4)+String(req.body.numCode5);

    try {
        var emailUpper = String(email).toUpperCase();
        var sql = 'SELECT * FROM users WHERE email = "'+emailUpper+'"';
        const user_found = await new Promise(resolve => {
            db.get(sql, (err, row) => {
                if (err) {
                    console.log("error message login = "+err.message);
                    resolve({ error : err.message});
                } else {
                    if(row != undefined && row != null){
                        resolve(row);
                    }
                    else{
                        resolve({ error :"Email not exist"});
                    }
                }
            });
        });
        if(user_found != null && user_found!= undefined && user_found.password != undefined){
            var user_found_password = user_found.password;
            const compare_password = await bcrypt.compare(password, user_found_password);
            if( compare_password){
                if( user_found.codeActivation != null && user_found.codeActivation != undefined){
                    if (code == user_found.codeActivation ){
                        return res.status(200).json({email: user_found.email, name: user_found.name, id: user_found.user_id, country: user_found.idCountry, continent: user_found.idContinent, message:'success'});
                    }
                    else{
                        return res.status(200).json({message:'errorCodeActivation'});
                    }
                }
                else{
                    return res.status(200).json({message:'serverError'});
                }
            }
            else{
                return res.status(200).json({message:'serverError'});
            }
        }
        else if(user_found != null && user_found!= undefined && user_found.password == undefined){
            if(user_found.error != null){
                if(user_found.error == "Email not exist"){
                    return res.status(200).json({message:'userNotFound'});
                }
                else{
                    return res.status(200).json({message:'serverError'});
                }
            }
            else{
                return res.status(200).json({message:'noPassword'});
            }
        }
        else{
            return res.status(200).json({message:'serverError'});
        }
    }catch(err){
        // handle
        console.log("error returned = "+err);
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.validateUser = async (req, res, next) =>{
    console.log("validateUser");
    const id = req.body.idUser;
    try {
        const result =  await User.validateUser(id);
        if (result.length !== 2){
            const error = new Error("userNotFound");
            error.statusCode = 401;
            throw error;
        }
        const resultValidUser = result[0];
        res.status(200).json({ fieldCount: resultValidUser.fieldCount, 
                                affectedRows:resultValidUser.affectedRows, 
                                insertId:resultValidUser.insertId,
                                info:resultValidUser.info,
                                serverStatus:resultValidUser.serverStatus,
                                warningStatus: resultValidUser.warningStatus,
                                changedRows: resultValidUser.changedRows});
    }
    catch (err) {
        if (!err.statusCode){
            err.statusCode  = 500;
        }
        next(err);
    }
}

exports.update = async (req, res, next) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return `${location}[${param}]: ${msg}`;
    };

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        // Response will contain something like
        // { errors: [ "body[password]: must be at least 10 chars long" ] }
        return res.json({ errors: errors.array() });
    }

    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        const userDetails = {
            id:id,
            name: name,
            email: email,
            password: hashedPassword
        }

        const result = await User.update(userDetails);
        res.status(201).json({ message: 'User updated !' });
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}

exports.createThing = async (req, res, next) => {
    console.log("createThing");
    const title = req.body.title;
    const description = req.body.description;
    const isPrivate = req.body.isPrivate;

    try {
        const user =  await User.find(email);

        if (user[0].length !== 1){
            const error = new Error("userNotFound");
            error.statusCode = 401;
            throw error;
        }

        const storedUser = user[0][0];

        if (storedUser.valid == 0){
            const error = new Error("userNotValid");
            error.statusCode = 401;
            throw error;
        }

        const isEqual = await bcrypt.compare(password, storedUser.password);

        if (!isEqual){
            const error = new Error("password");
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign(
            {
                email: storedUser.email,
                userId: storedUser.id
            },
            'secretfortoken',
            { expiresIn: '60000' }
        );

        res.status(200).json({ token: token, userId: storedUser.id});
    }catch (err) {
        if (!err.statusCode){
            err.statusCode  = 500;
        }
        next(err);
    }
}

exports.sendmailcode = async (req, res, next) => {
    console.log("youhou");
    
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
    });
    try {
        var emailUpper = String(req.body.email).toUpperCase();
        console.log("emailUpper = "+emailUpper);
        var sql = 'SELECT * FROM users WHERE email = "'+emailUpper+'"';
        const user_found = await new Promise(resolve => {
            db.get(sql, (err, row) => {
            if (err) {
                console.log("error message sendmailcode = "+err.message);
                resolve({ error : err.message});
            } else {
                if(row != undefined && row != null){
                    console.log("user found sendmailcode = "+JSON.stringify(row));
                    resolve(row);
                }
                else{
                    resolve({ error :"Email not exist"});
                }
            }
            });
        });
        if(user_found != null && user_found!= undefined && user_found.password != undefined){
            var user_found_code = user_found.codeActivation;
            var user_email = user_found.email;
            var user_name = user_found.name;
            var user_country = user_found.idCountry;
            if(user_found_code!=undefined && user_found_code!=""){
                const logo_imgData = fs.readFileSync(path.resolve(__dirname, "./logo_2.png"), {encoding: 'base64'});
                const mail_imgData = fs.readFileSync(path.resolve(__dirname, "./mailicon.png"), {encoding: 'base64'});
                let mailOptions = {
                    from: '"Cbcpb', // sender address
                    to: user_email, // list of receivers
                    subject: "Wellcome to Cbcpb", // Subject line
                    proxy:"http://localhost:4200",
                    html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" lang="en">
 <head>
  <meta charset="UTF-8">
  <meta content="width=device-width, initial-scale=1" name="viewport">
  <meta name="x-apple-disable-message-reformatting">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta content="telephone=no" name="format-detection">
  <meta name="robots" content="noarchive">
<style type="text/css">
.rollover:hover .rollover-first {
  max-height:0px!important;
  display:none!important;
}
.rollover:hover .rollover-second {
  max-height:none!important;
  display:block!important;
}
.rollover span {
  font-size:0px;
}
u + .body img ~ div div {
  display:none;
}
#outlook a {
  padding:0;
}
span.MsoHyperlink,
span.MsoHyperlinkFollowed {
  color:inherit;
  mso-style-priority:99;
}
a.es-button {
  mso-style-priority:100!important;
  text-decoration:none!important;
}
a[x-apple-data-detectors],
#MessageViewBody a {
  color:inherit!important;
  text-decoration:none!important;
  font-size:inherit!important;
  font-family:inherit!important;
  font-weight:inherit!important;
  line-height:inherit!important;
}
.es-desk-hidden {
  display:none;
  float:left;
  overflow:hidden;
  width:0;
  max-height:0;
  line-height:0;
  mso-hide:all;
}
@media only screen and (max-width:600px) {.es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-p-default { } *[class="gmail-fix"] { display:none!important } p, a { line-height:150%!important } h1, h1 a { line-height:120%!important } h2, h2 a { line-height:120%!important } h3, h3 a { line-height:120%!important } h4, h4 a { line-height:120%!important } h5, h5 a { line-height:120%!important } h6, h6 a { line-height:120%!important } .es-header-body p { } .es-content-body p { } .es-footer-body p { } .es-infoblock p { } h1 { font-size:36px!important; text-align:left } h2 { font-size:26px!important; text-align:left } h3 { font-size:20px!important; text-align:left } h4 { font-size:24px!important; text-align:left } h5 { font-size:20px!important; text-align:left } h6 { font-size:16px!important; text-align:left } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:36px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-header-body h4 a, .es-content-body h4 a, .es-footer-body h4 a { font-size:24px!important } .es-header-body h5 a, .es-content-body h5 a, .es-footer-body h5 a { font-size:20px!important } .es-header-body h6 a, .es-content-body h6 a, .es-footer-body h6 a { font-size:16px!important } .es-menu td a { font-size:12px!important } .es-header-body p, .es-header-body a { font-size:14px!important } .es-content-body p, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock a { font-size:12px!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3, .es-m-txt-c h4, .es-m-txt-c h5, .es-m-txt-c h6 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3, .es-m-txt-r h4, .es-m-txt-r h5, .es-m-txt-r h6 { text-align:right!important } .es-m-txt-j, .es-m-txt-j h1, .es-m-txt-j h2, .es-m-txt-j h3, .es-m-txt-j h4, .es-m-txt-j h5, .es-m-txt-j h6 { text-align:justify!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3, .es-m-txt-l h4, .es-m-txt-l h5, .es-m-txt-l h6 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-m-txt-r .rollover:hover .rollover-second, .es-m-txt-c .rollover:hover .rollover-second, .es-m-txt-l .rollover:hover .rollover-second { display:inline!important } .es-m-txt-r .rollover span, .es-m-txt-c .rollover span, .es-m-txt-l .rollover span { line-height:0!important; font-size:0!important; display:block } .es-spacer { display:inline-table } a.es-button, button.es-button { font-size:20px!important; padding:10px 20px 10px 20px!important; line-height:120%!important } a.es-button, button.es-button, .es-button-border { display:inline-block!important } .es-m-fw, .es-m-fw.es-fw, .es-m-fw .es-button { display:block!important } .es-m-il, .es-m-il .es-button, .es-social, .es-social td, .es-menu { display:inline-block!important } .es-adaptive table, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .adapt-img { width:100%!important; height:auto!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } .h-auto { height:auto!important } }
@media screen and (max-width:384px) {.mail-message-content { width:414px!important } }
</style>
 <body class="body" style="width:100%;height:100%;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
  <div dir="ltr" class="es-wrapper-color" lang="en" style="background-color:#FAFAFA">
   <table width="100%" cellspacing="0" cellpadding="0" class="es-wrapper" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;background-color:#FAFAFA">
     <tr>
      <td valign="top" style="padding:0;Margin:0">
       <table cellpadding="0" cellspacing="0" align="center" class="es-header" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="es-header-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:600px">
             <tr>
              <td align="left" style="Margin:0;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td valign="top" align="center" class="es-m-p0r" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-bottom:20px;font-size:0px"><img src="data:image/png;base64,${logo_imgData}" alt="Logo" width="200" title="Logo" class="adapt-img" style="display:block;font-size:12px;border:0;outline:none;text-decoration:none"></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-content" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table bgcolor="#ffffff" align="center" cellpadding="0" cellspacing="0" class="es-content-body" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#FFFFFF;width:600px">
             <tr>
              <td align="left" style="Margin:0;padding-right:20px;padding-bottom:10px;padding-left:20px;padding-top:30px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:10px;padding-bottom:10px;font-size:0px"><img src="data:image/png;base64,${mail_imgData}" alt="" width="100" class="adapt-img" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-bottom:10px"><h1 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:46px;color:#333333">Your account has been verified</h1></td>
                     </tr>
                     <tr>
                      <td align="center" class="es-m-p0r es-m-p0l" style="Margin:0;padding-top:5px;padding-right:40px;padding-bottom:5px;padding-left:40px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">But to access your Cbcpb to add/edit/vote on it</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:21px;letter-spacing:0;color:#333333;font-size:14px">You need to copy this security code below to it</p></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
             <tr>
              <td align="left" style="Margin:0;padding-top:10px;padding-right:20px;padding-bottom:10px;padding-left:20px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="center" valign="top" style="padding:0;Margin:0;width:560px">
                   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-left:2px dashed #cccccc;border-right:2px dashed #cccccc;border-top:2px dashed #cccccc;border-bottom:2px dashed #cccccc;border-radius:5px" role="presentation">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-right:20px;padding-left:20px;padding-top:20px"><h2 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:26px;font-style:normal;font-weight:bold;line-height:31.2px;color:#333333">Your security code&nbsp;</h2></td>
                     </tr>
                     <tr>
                      <td align="center" style="Margin:0;padding-top:10px;padding-right:20px;padding-left:20px;padding-bottom:20px"><h1 class="es-m-txt-c" style="Margin:0;font-family:arial, 'helvetica neue', helvetica, sans-serif;mso-line-height-rule:exactly;letter-spacing:0;font-size:46px;font-style:normal;font-weight:bold;line-height:55.2px;color:#5c68e2"><strong>${user_found_code}</strong></h1></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       <table cellpadding="0" cellspacing="0" align="center" class="es-footer" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:100%;table-layout:fixed !important;background-color:transparent;background-repeat:repeat;background-position:center top">
         <tr>
          <td align="center" style="padding:0;Margin:0">
           <table align="center" cellpadding="0" cellspacing="0" class="es-footer-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:640px" role="none">
             <tr>
              <td align="left" style="Margin:0;padding-right:20px;padding-left:20px;padding-bottom:20px;padding-top:20px">
               <table cellpadding="0" cellspacing="0" width="100%" role="none" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                 <tr>
                  <td align="left" style="padding:0;Margin:0;width:600px">
                   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-top:15px;padding-bottom:15px;font-size:0">
                       <table cellpadding="0" cellspacing="0" class="es-table-not-adapt es-social" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr>
                          <td align="center" valign="top" style="padding:0;Margin:0;padding-right:40px"><img title="Instagram" src="https://ewbwlhc.stripocdn.email/content/assets/img/social-icons/logo-black/instagram-logo-black.png" alt="Inst" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                          <td align="center" valign="top" style="padding:0;Margin:0"><img title="BlueSky" src="https://ewbwlhc.stripocdn.email/content/assets/img/social-icons/logo-black/bluesky-logo-black.png" alt="BlueSky" width="32" style="display:block;font-size:14px;border:0;outline:none;text-decoration:none"></td>
                         </tr>
                       </table></td>
                     </tr>
                     <tr>
                      <td align="center" style="padding:0;Margin:0;padding-bottom:35px"><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">Cbcpb © 2025 Style Casual, Inc. All Rights Reserved.</p><p style="Margin:0;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:18px;letter-spacing:0;color:#333333;font-size:12px">13 rue du faisan , 67600 Hilsenheim, France</p></td>
                     </tr>
                     <tr>
                      <td style="padding:0;Margin:0">
                       <table cellpadding="0" cellspacing="0" width="100%" class="es-menu" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                         <tr class="links">
                          <td align="center" valign="top" width="33.33%" style="Margin:0;border:0;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px">
                           <div style="vertical-align:middle;display:block"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#999999;font-size:12px">Visit Us </a>
                           </div></td>
                          <td align="center" valign="top" width="33.33%" style="Margin:0;border:0;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;border-left:1px solid #cccccc">
                           <div style="vertical-align:middle;display:block"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#999999;font-size:12px">Privacy Policy</a>
                           </div></td>
                          <td align="center" valign="top" width="33.33%" style="Margin:0;border:0;padding-top:5px;padding-bottom:5px;padding-right:5px;padding-left:5px;border-left:1px solid #cccccc">
                           <div style="vertical-align:middle;display:block"><a target="_blank" href="" style="mso-line-height-rule:exactly;text-decoration:none;font-family:arial, 'helvetica neue', helvetica, sans-serif;display:block;color:#999999;font-size:12px">Terms of Use</a>
                           </div></td>
                         </tr>
                       </table></td>
                     </tr>
                   </table></td>
                 </tr>
               </table></td>
             </tr>
           </table></td>
         </tr>
       </table>
       </td>
     </tr>
   </table>
  </div>
 </body>
</html>`
                };

                // send mail with defined transport object
                let info = await transporter.sendMail(mailOptions);

                //callback(info);
                return res.status(200).json(info);
            }
            else{
                return res.status(200).json("serverError no code");
            }
        }
        else{
            return res.status(200).json("serverError");
        }
    }catch(err){
        // handle
        console.log("error returned = "+err);
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}