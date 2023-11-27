import * as dotenv from 'dotenv';
import * as process from "process";

dotenv.config()

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
