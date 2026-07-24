import { body } from "express-validator";
import { validate } from "./validate.js";

export const createProductValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 5000 })
    .withMessage("Description must be between 20 and 5000 characters"),

  body("shortDescription")
    .trim()
    .notEmpty()
    .withMessage("Short description is required")
    .isLength({ min: 10, max: 300 })
    .withMessage("Short description must be between 10 and 300 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string"),

  body("subCategory")
    .trim()
    .notEmpty()
    .withMessage("Sub category is required")
    .isString()
    .withMessage("Sub category must be a string"),
  body("brand")
    .notEmpty()
    .withMessage("Brand is required")
    .isString()
    .withMessage("Invalid brand"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("barcode")
    .optional()
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage("Barcode must be between 6 and 50 characters"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters"),

  body("status")
    .optional()
    .isIn(["Draft", "Published", "Archived"])
    .withMessage("Invalid product status"),

  body("visibility")
    .optional()
    .isIn(["Public", "Private"])
    .withMessage("Invalid visibility"),

  body("isFeatured")
    .optional()
    .isBoolean()
    .withMessage("isFeatured must be true or false"),
  body("discount")
    .optional()
    .isNumeric()
    .withMessage("Discount must be a number")
    .isFloat({ min: 0, max: 100 })
    .withMessage("Discount must be between 0 and 100"),
  validate,
];
