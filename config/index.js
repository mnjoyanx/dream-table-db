const production = false;

const db = {
  production: {
    host: "localhost",
    username: "rot",
    password: "",
    database: "test",
    dialect: "mysql",
    logging: false,
  },
  dev: {
    host: "localhost",
    username: "inoclouds",
    password: "inoclouds",
    database: "dream-table",
    dialect: "mysql",
    logging: false,
  },
};

module.exports = {
  port: 3000,
  db: production ? db.production : db.dev,
  JWT: {},
};
