const express = require('express');
const rateLimit = require('express-rate-limit');

const { config } = require("dotenv");
const { initializeDatabase, checkTablesExistence, checkAllCountries } = require("./util/database");
const logger = require("./logger.js");
logger.info(`Debut du lancement du serveur`);

config();

const app = express();

// Initialiser la base de données
initializeDatabase();
// Verifications de l'initialisation de la base de données
checkTablesExistence();

checkAllCountries();

// Définir les limites de taux
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
    message: 'Trop de requêtes créées à partir de cette IP, veuillez réessayer après 15 minutes',
});
  
// Appliquer le middleware de limitation de taux à toutes les requêtes
app.use(limiter);

// Middleware pour parser le corps des requêtes JSON
app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    //res.header("Access-Control-Allow-Origin","http://localhost:4200");
    res.header("Access-Control-Allow-Methods","GET, POST, PUT, DELETE, PATCH, OPTIONS");
    res.header("Access-Control-Allow-Headers", "*");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Request-Headers", "*");
    res.header("Access-Control-Allow-Credentials", "true");

    // Pass to next layer of middleware
    next(); // Requête autorisée
});

const bodyParser = require ('body-parser');
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const authRoutes = require('./routes/auth');
const countryUserRoutes = require('./routes/countryUser');
const typeThingsRoutes = require('./routes/typeThing.js');
const thingRoutes = require('./routes/thing');
const countryRoutes = require('./routes/country');
const continentRoutes = require('./routes/continent');
const votesRoutes = require('./routes/votes');
const errorController = require ('./controllers/error');

app.use("/auth", authRoutes);
app.use("/thing", thingRoutes);
app.use("/country", countryRoutes);
app.use("/countryUser", countryUserRoutes);
app.use("/continent", continentRoutes);
app.use("/typesthing", typeThingsRoutes);
app.use("/votes", votesRoutes);

app.use(errorController.get404);
app.use(errorController.get500);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

