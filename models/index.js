let Sequelize = require('sequelize');

let {
    database,
    username,
    password,
    host,
    dialect
} = require("../config").db;

let sequelize = new Sequelize(database, username, password, {
    host,
    dialect
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const Table_1 = require('./tables/table_1')(sequelize, Sequelize);


sequelize.sync()
    .then(() => {
        console.log('sync ended');
        require('./seeder')();
    })
    .catch(err => {
        console.log(err.message);
    });

module.exports = {
    Op: Sequelize.Op,
    Sequelize,
    Table_1,
}