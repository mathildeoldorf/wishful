const credentials = require('./config/dbCredentials');
const knexSnakeCaseMapper = require('objection').knexSnakeCaseMappers;

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      database: credentials.development.database,
      user: credentials.development.user,
      password: credentials.development.password
    }
  },
  production: {
    client: 'mysql',
    connection: {
      database: credentials.production.database,
      user: credentials.production.user,
      password: credentials.production.password
    }
  },
  ...knexSnakeCaseMapper()


};