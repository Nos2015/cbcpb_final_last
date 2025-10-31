const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    const skipHeader = req.get("skip");
    console.log("middleware authHeader = "+authHeader);
    console.log("middleware skipHeader = "+skipHeader);
    if (skipHeader != undefined){
        console.log("middleware not skipHeader");
        if (authHeader == undefined){
            console.log("middleware not authHeader");
            const error = new Error('Not authenticated!');
            error.statusCode = 401;
            throw error;
        }
    
        const token = authHeader.split(' ')[1];
        console.log("middleware token = "+token);
        let decodedToken;
        try{
            decodedToken = jwt.verify(token, 'secretfortoken');
        }catch (err){
            console.log("middleware error jwt verify");
            err.statusCode = 500;
            throw err;
        }
        
        if (!decodedToken){
            console.log("middleware not decodedToken"); 
            const error = new Error('Not authenticated!');
            error.statusCode = 401;
            throw error;
        }
    
        req.isLoggedIn = true;
        req.userId = decodedToken.userId;
        console.log("middleware req.userId ="+req.userId); 
        req.email = decodedToken.email;
        console.log("middleware req.email ="+req.email);
    }
    
    next();
}