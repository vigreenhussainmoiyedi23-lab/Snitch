// utils/cookie.js
import type { Response } from "express";


const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
};

/**
 * Sends a cookie with standardized security settings.
 * @param {import('express').Response} res - The Express response object
 * @param {string} name - Name of the cookie
 * @param {string} value - Cookie payload/token
 * @param {number} maxAgeInMs - Expiration time in milliseconds
 */

export const sendSecureCookie = (res: Response, name:string, value:string, maxAgeInMs:number) => {
  res.cookie(name, value, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: maxAgeInMs,
  });
};

/**
 * Clears a cookie with matching security settings.
 */
export const clearSecureCookie = (res: Response, name:string) => {
  res.clearCookie(name, BASE_COOKIE_OPTIONS);
};

export default { sendSecureCookie, clearSecureCookie };
