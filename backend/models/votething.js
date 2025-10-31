const db = require('../util/database');

module.exports = class Votething{
    constructor(id, idThing, idCountry, idContinent, date, cb){
        this.id = id;
        this.idThing = idThing;
        this.idCountry = idCountry;
        this.idContinent = idContinent;
        this.date = date;
        this.cb = cb;
    }
}