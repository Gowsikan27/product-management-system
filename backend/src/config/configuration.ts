export default () => ({
  port: parseInt(process.env.PORT ?? '3001', 10),
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '1h',
  },
});