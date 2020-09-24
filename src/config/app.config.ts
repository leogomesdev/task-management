import * as dotenv from 'dotenv';
dotenv.config();

const appConfig = {
  port: parseInt(process.env.PORT, 10) || 3000,
  origin: process.env.ORIGIN || '"*"',
};

export default appConfig;
