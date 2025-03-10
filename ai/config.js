import dotenv from 'dotenv';

dotenv.config();

export const config = {
  apiKey: process.env.API_KEY,
  apiUrl: process.env.API_URL,
  src: process.env.SRC,
};

