const Country = require('../models/country');
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("cbcpb_general_db.db", sqlite3.OPEN_READWRITE, (err)=>{
    if (err) return console.error(err); 
});

const dropTableUsers = false;

const initializeDatabase = () => {
  if (dropTableUsers === true) {
    db.run("DROP TABLE IF EXISTS users", (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Table 'users' supprimée.");
    });
  }

  db.serialize(() => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        user_id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        name TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        idCountry INTEGER NOT NULL,
        codeActivation INTEGER NOT NULL UNIQUE
      )`,
      (err) => {
        if (err) {
          return console.error(err.message);
        }
      }
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS countries (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          idContinent INTEGER NOT NULL,
          name TEXT NOT NULL UNIQUE,
          namefr TEXT NOT NULL UNIQUE,
          image TEXT,
          lowercase_name TEXT NOT NULL UNIQUE,
          lowercase_nameFr TEXT NOT NULL UNIQUE
        )`,
        (err) => {
          if (err) {
            return console.error(err.message);
          }
        }
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS continents (
          id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          name TEXT NOT NULL UNIQUE,
          namefr TEXT NOT NULL UNIQUE,
          image TEXT,
          lowercase_name TEXT NOT NULL UNIQUE,
          lowercase_nameFr TEXT NOT NULL UNIQUE
        )`,
        (err) => {
          if (err) {
            return console.error(err.message);
          }
        }
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS things (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            name TEXT NOT NULL UNIQUE,
            description TEXT NOT NULL,
            user TEXT
        )`,
        (err) => {
            if (err) {
            return console.error(err.message);
            }
        }
    );

    db.run(
        `CREATE TABLE IF NOT EXISTS vote_things (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            idThing INTEGER NOT NULL,
            idCountry INTEGER NOT NULL,
            idContinent INTEGER NOT NULL,
            cb INTEGER DEFAULT 0
        )`,
        (err) => {
            if (err) {
            return console.error(err.message);
            }
        }
    );
    });
};

const checkTablesExistence = () => {
  const tables = ["users", "countries", "continents", "things", "vote_things"];
  let missingTables = [];

  tables.forEach((table) => {
    db.get(
      `SELECT name FROM sqlite_master WHERE type='table' AND name='${table}'`,
      (err, row) => {
        if (err) {
          console.error(err.message);
        } else if (!row) {
          missingTables.push(table);
        }
      }
    );
  });
};

const checkAllCountries = () => {
    const numberOfCountries = Country.checkAllCountries();
    if (numberOfCountries == 0){
      Country.insertAllCountry();
    }
};

module.exports = { db, initializeDatabase, checkTablesExistence, checkAllCountries };
