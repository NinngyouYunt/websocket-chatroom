const config = {
  cors: {
    origin: "http://example.com",
    optionsSuccessStatus: 200
  },
  port: process.env.PORT || 3000,
  sessionSecret: "klsdjfaoi12n3"
};

module.exports = config;
