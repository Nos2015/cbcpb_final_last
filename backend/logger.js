const winston = require("winston");

// Création d'un format personnalisé pour la console
const consoleFormat = winston.format.combine(
  winston.format.colorize(),    // Ajoute des couleurs pour une meilleure lisibilité
  winston.format.simple()       // Format simple pour les messages
);

const fileFormat = winston.format.json(); // Format JSON pour les fichiers

const logger = winston.createLogger({
  level: "debug",
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    new winston.transports.File({
      filename: "log/error.log",
      level: "error",
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: "log/combined.log",
      format: fileFormat,
    }),
    new winston.transports.File({
      filename: "log/debug.log",
      level: "debug",
      format: fileFormat,
    }),
  ],
});

module.exports = logger;
