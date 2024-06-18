/* global process */
import { v4 as uuidv4 } from 'uuid';

export const AUTH_TOKEN = process.env.AUTH_TOKEN;
export const BASE_URL = process.env.BASE_URL;
export const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN;
export const ADMIN_URL = process.env.ADMIN_URL;
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
export const EXECUTION_ID = uuidv4();
