const db = require('../util/database');

module.exports = class Continent{
    constructor(id, name, nameFr, lowercase_nameFr, lowercase_name){
        this.id = id;
        this.name = name;
        this.nameFr = nameFr;
        this.lowercase_nameFr = lowercase_nameFr;
        this.lowercase_name = lowercase_name;
    }

    static fetchAll(lang){
        if (lang === "en"){
            return db.promise().execute('SELECT * FROM continents order by name');
        }
        else{
            return db.promise().execute('SELECT * FROM continents order by nameFr');
        }
    }
}