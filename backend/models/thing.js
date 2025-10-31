const db = require('../util/database');

module.exports = class Thing {
    constructor(name, description, user){
        this.name = name;
        this.description = description;
        this.user = user;
    }

    static fetchAll(){
        return db.promise().execute('SELECT * FROM things order by id');
    }

    static fetchAllGeneralPersonal(id){
        return db.promise().execute('SELECT * FROM things where idUser ='+id+' order by id');
    }

    static fetchAllTen(){
        return db.promise().execute('SELECT * FROM things order by id asc limit 10');
    }

    static fetchAllGood(){
        return db.promise().execute('SELECT * FROM things where cb > cpb order by id');
    }

    static fetchAllGoodTen(){
        return db.promise().execute('SELECT * FROM things where cb > cpb order by id asc limit 10');
    }

    static fetchAllNotGood(){
        return db.promise().execute('SELECT * FROM things where cpb > cb order by id');
    }

    static fetchAllNotGoodTen(){
        return db.promise().execute('SELECT * FROM things where cpb > cb order by id asc limit 10');
    }

    static fetchAllEqual(){
        return db.promise().execute('SELECT * FROM things where cpb = cb order by id');
    }

    static fetchAllEqualTen(){
        return db.promise().execute('SELECT * FROM things where cpb = cb order by id asc limit 10');
    }

    static fetchThingWithId(id){
        return db.promise().execute('SELECT * FROM things where id = '+id);
    }
    
    static save(thing){
        return db.connect(function(err) {
            if (err) throw err;
            var sql = 'INSERT INTO things (name, description, idUser) VALUES ("'+String(thing.name)+'","'+String(thing.description)+'",'+ thing.user+')';
            db.query(sql, function (err, result) {
              if (err) throw err;
            });
        });
    }

    static delete(id){
        return db.connect(function(err) {
            if (err) throw err;
            var sql = 'DELETE FROM things WHERE id = '+id;
            db.query(sql, function (err, result) {
              if (err) throw err;
            });
        });
    }
};