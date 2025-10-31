const { validationResult } = require('express-validator');

const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getCountryUser = async (req, res, next) => {
    const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
        // Build your resulting errors however you want! String, object, whatever - it works!
        return `${location}[${param}]: ${msg}`;
    };

    const errors = validationResult(req).formatWith(errorFormatter);
    if (!errors.isEmpty()) {
        // Response will contain something like
        // { errors: [ "body[password]: must be at least 10 chars long" ] }
        return res.json({ errors: errors });
    }
    try {
        const result = await $.get("https://api.ipdata.co?api-key=6d24128719b9264f9907539f64294402bf52006a5b8c4138783c6b46", function(response) {
        }, "jsonp");
        res.status(200).json({ result: result});
    }catch(err){
        // handle
        if (!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }
}