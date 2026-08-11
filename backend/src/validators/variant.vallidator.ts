import { body } from "express-validator";
import { validate } from "./validate.js";

export const variantValidator = [
  body("variants").isArray().withMessage("Variants must be an array"),
];

export const createVariantValidator = [
  body("mrp").optional().isNumeric().withMessage("MRP must be a number"),
  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),
  body("attributes").isString().withMessage("Attributes must be a string"),
  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  validate,
];
