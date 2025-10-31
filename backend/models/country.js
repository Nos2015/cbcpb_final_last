const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cbcpb_general_db.db", sqlite3.OPEN_READWRITE, (err)=>{
    if (err) return console.error(err); 
});
const all_countries = require('../config/countries_new.json');

module.exports = class Country{
    constructor(idContinent, name, namefr, img, lowercase_nameFr, lowercase_name){
        this.idContinent = idContinent;
        this.name = name;
        this.namefr = namefr;
        this.img = img;
        this.lowercase_nameFr = lowercase_nameFr;
        this.lowercase_name = lowercase_name;
    }

    static insertAllCountry(){
        all_countries.forEach((country) => {
            console.log("idContinent ="+String(country.idContinent));
            console.log("name ="+String(country.name));
            console.log("namefr ="+String(country.namefr));
            console.log("img ="+String(country.img));
            var sql = 'INSERT INTO countries (idContinent, name, namefr, image, lowercase_name, lowercase_nameFr) VALUES ("'+String(country.idContinent)+'","'+String(country.name)+'","'+String(country.namefr)+'","'+String(country.img)+'","'+ String(country.name.toLocaleLowerCase())+'","'+ String(country.namefr.toLocaleLowerCase())+'")';
            db.run(sql, function (err, result) {
                if (err) throw err;
            });
        });
    }

    static checkAllCountries(){
        db.all('SELECT * FROM countries',(err, result)=>{
            if (err){
                console.log("err = "+err);
                return err;
            }
            else{
                return result.length;
            }
         }
        )
    }

    static findCountry(name){
        return db.get('SELECT * FROM countries WHERE name = ?', [name]);
    }

    static fetchAll(lang){
        console.log("fetch all countries from front-end");
        if (lang === "en"){
            console.log("english");
            return db.all('SELECT * FROM countries order by name'),(err, result)=>{
                if (err){
                    console.log("err = "+err);
                    return err;
                }
                else{
                    return result;
                }
            }
        }
        else{
            console.log("french");
            return db.all('SELECT * FROM countries order by namefr',(err, result)=>{
                if (err){
                    console.log("err = "+err);
                    return err;
                }
                else{
                    return result;
                }
             }
         )
        }
    }
}
