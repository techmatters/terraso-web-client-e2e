/* global process */
import { v4 as uuidv4 } from 'uuid';

export const AUTH_TOKEN = process.env.AUTH_TOKEN;
export const BASE_URL = process.env.BASE_URL;
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
export const EXECUTION_ID = uuidv4();
