import { body } from "express-validator";

export const variantValidator = [
    body("variants").isArray().withMessage("Variants must be an array"),
];

export const createVariantValidator = [body("mrp")];