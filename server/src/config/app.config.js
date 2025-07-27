import dotenv from "dotenv";

dotenv.config();

const config= {
  port: process.env.PORT,
  db: {
    url: process.env.DB_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET|| "secret",
    expiresIn: process.env.JWT_EXPIRES,
  },
};

export default config;
