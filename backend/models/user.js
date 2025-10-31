const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cbcpb_general_db.db", sqlite3.OPEN_READWRITE, (err)=>{
    if (err) {
        return console.error("in user models error =" +err);
    }
    else{
        console.log("success user model");
    } 
});

module.exports = class User {
    constructor(name, email, password, idCountry){
        this.name = name;
        this.email = email;
        this.password = password;
        this.idCountry = idCountry;
        this.message = "";
    }

    static find(email){
        return db.promise().execute('SELECT * FROM users WHERE email = ?', [email]);
    }

    static findName (name){
        console.log("name search = "+name);
        return db.get('SELECT * FROM users WHERE name = ?', [name],(err, result)=>{
            if (err){
                console.log("err = "+err);
                return err;
            }
            else{
                console.log("result for all = "+result);
                return result;
            }
         }
        )
    }

    /*static findName(name){
        return db.promise().execute('SELECT * FROM users WHERE username = ?', [name]);
    }*/

    static findSameUsers(name){
        //select username from users where username REGEXP "testcreate[0-9]+" order by username
        const regexp = name + "[0-9]+";
        //return db.promise().execute('select username from users where username REGEXP = ? order by username', [regexp]);
        return db.promise().execute('select REPLACE(username,?,"") as username from users where username REGEXP ? order by username', [name, regexp]);
    }

    static findAdmin(username){
        return db.promise().execute('SELECT * FROM mysql.user WHERE User = ?', [username]);
    }

    static getname(id){
        return db.promise().execute('SELECT username FROM users WHERE id = ?', [id]);
    }

    static canprivate(id){
        return db.promise().execute('SELECT canprivate FROM users WHERE id = ?', [id]);
    }

    static getcountry(id){
        return db.promise().execute('SELECT * from country where id =(SELECT idCountry FROM users WHERE id = ?)', [id]);
    }
    
    static save(user){
        var sql = 'INSERT INTO users (name, password, idCountry, codeActivation, email) VALUES ("'+String(user.name)+'","'+String(user.password)+'",'+String(user.idCountry)+','+user.codeActivation+',"'+String(user.email)+'")';
        return db.run(sql, function (err) {
            consult ("result db run = "+err);
            return err
        });
    }

    static update(user){
        return db.connect(function(err) {
            if (err) throw err;
            var sql = 'UPDATE users (username, password, email) VALUES ("'+String(user.name)+'","'+String(user.password)+'","'+ String(user.email)+' WHERE id='+String(user.id)+')';
            db.query(sql, function (err, result) {
              if (err) throw err;
            });
        });
    }

    static updateCode(user){
        console.log("updateCode email ="+user.email);
        console.log("updateCode codeActivation ="+user.codeActivation);
        var sql = 'UPDATE users set codeActivation = '+Number(user.codeActivation)+' WHERE email="'+String(user.email).toUpperCase()+'"';
        console.log("sql to update code = "+sql);
        return db.run(sql ,(err, result)=>{
                console.log("result updateCode ="+JSON.stringify(result));
                if (err){
                    const errString = err.toString();
                    console.log("errString update code = "+errString);
                    return res.status(200).json(errString);
                }
                else{
                    console.log("success to update user for update code")
                    res.status(200).json("success");
                }
        });
    }

    static checkCode(email, code){
        var sql = 'SELECT * FROM users WHERE email ="'+String(email)+'" and validAccount ='+String(code);
        return db.promise().execute(sql);
    }

    static validateUser(id){
        return db.promise().execute('UPDATE users set valid = 1 WHERE id = ?',[id]);
    }
}