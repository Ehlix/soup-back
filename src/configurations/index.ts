export default () => ({
  corsOrigin: process.env.CORS_ORIGIN,
  port: process.env.PORT,
  postgresHost: process.env.POSTGRES_HOST,
  postgresPort: process.env.POSTGRES_PORT,
  postgresUser: process.env.POSTGRES_USER,
  postgresDatabase: process.env.POSTGRES_DB,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiration: process.env.JWT_ACCESS_EXPIRATION,
  jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION,
});
