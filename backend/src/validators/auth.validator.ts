import { body } from "express-validator";
import { validate } from "./validate.js";

export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),

  body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/)
    .matches(/[!@#$%^&*]/)
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character",
    ),
  validate,
];

export const loginValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8 })
    .matches(/[A-Z]/)
    .matches(/[a-z]/)
    .matches(/[0-9]/)
    .matches(/[!@#$%^&*]/)
    .withMessage(
      "Password must contain uppercase, lowercase, number and special character",
    ),
  validate,
];
