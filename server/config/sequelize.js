const mysql = require('mysql2/promise');
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const env = process.env.NODE_ENV || 'development';
const config = require('./dbConfig.json')[env];

const db = {};

global.dbConnection = [];

async function initialise() {

  let connection = await mysql.createConnection({
    user: config.username,
    password: config.password,
  });
  await connection.query('CREATE DATABASE IF NOT EXISTS testDb;')

  const sequelizeOptions = {
    dialect: config.dialect,
    port: config.port,
    host: config.host,
    operatorsAliases: false,
    ssl: true,
    native: false,

    pool: {
      max: 5,
      min: 0,
      idle: 10000
    }
  };

  /* ToDo:
        CASE: in future if we deploy tenant dbs on their custom specified position

        Update: Here , first from organisation table get the dbConfig and then create to sequelise. But always check if a connection to that dbAlready exists with sequelize or not.
    */
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    sequelizeOptions
  );

  let modelsDir = path.normalize(`${__dirname}/../models`);

  // loop through all files in models directory ignoring hidden files and this file
  fs.readdirSync(modelsDir)
    .filter(file => file.indexOf('.') !== 0 && file.indexOf('.map') === -1)
    // import model files and save model names
    .forEach(file => {
      console.log(`Loading model file ${file}`); // eslint-disable-line no-console
      const model = sequelize.import(path.join(modelsDir, file));
      db[model.name] = model;
    });
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  try {
    // Synchronizing any model changes with database.
    await sequelize.sync();
    console.log('Database synchronized');
    let currentSchemas = Object.assign(
      {
        sequelize,
        Sequelize
      },
      db
    );
    dbConnection = currentSchemas;
    return currentSchemas;
  } catch (error) {
    console.log('An error occured %j', error);
    throw error;
  }
}

// assign the sequelize variables to the db object and returning the db.
module.exports = {
  initialise
};
