import * as dotenv from 'dotenv';
dotenv.config();

const jwtConfig = {
  secret: process.env.JWT_SECRET || 'XPTO',
  expiresIn: parseInt(process.env.JWT_EXPIRES_IN, 10) || 36000,
};

export default jwtConfig;
