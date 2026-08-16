import { body, checkExact, query } from "express-validator";
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

  body("tags").optional().isString().withMessage("Invalid tags"),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Invalid product status"),

  body("visibility")
    .optional()
    .isIn(["public", "private"])
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
  body("options")
    .optional()
    .custom((value, { req }) => {
      let parsedValue = value;

      // 1. If it's a string, clean up broken client-side single quotes
      if (typeof parsedValue === "string") {
        try {
          // Removes single quotes immediately surrounding brackets: :'[' to :[ and ]' to ]
          let cleaned = parsedValue
            .replace(/:\s*['"`](\s*\[.*?\]\s*)['"`]/g, ":$1")
            .trim();

          parsedValue = JSON.parse(cleaned);
        } catch (e) {
          throw new Error("Options field contains invalid JSON formatting");
        }
      }

      // 2. Ensure the top-level structure resolved to an array
      if (!Array.isArray(parsedValue)) {
        throw new Error("Options must be an array structure");
      }

      // 3. Inspect inner objects safely
      parsedValue.forEach((val: any) => {
        if (!val || typeof val !== "object") {
          throw new Error("Invalid option item format");
        }
        if (!val.name || !val.values) {
          throw new Error("Option name and values are required");
        }

        // Ensure values field within the object is a valid array
        let internalValues = val.values;
        if (typeof internalValues === "string") {
          try {
            internalValues = JSON.parse(internalValues);
          } catch (e) {
            throw new Error(`Invalid values array for option: ${val.name}`);
          }
        }

        if (!Array.isArray(internalValues)) {
          throw new Error(`Values property for '${val.name}' must be an array`);
        }

        // Save the cleaned inner array back
        val.values = internalValues;
      });

      // 4. Overwrite request body with clean JavaScript objects
      req.body.options = parsedValue;
      return true;
    }),
  validate,
];

export const updateProductValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 150 })
    .withMessage("Title must be between 3 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 20, max: 5000 })
    .withMessage("Description must be between 20 and 5000 characters"),

  body("shortDescription")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Short description is required")
    .isLength({ min: 10, max: 300 })
    .withMessage("Short description must be between 10 and 300 characters"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category is required")
    .isString()
    .withMessage("Category must be a string"),

  body("subCategory")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Sub category is required")
    .isString()
    .withMessage("Sub category must be a string"),
  body("brand")
    .optional()
    .notEmpty()
    .withMessage("Brand is required")
    .isString()
    .withMessage("Invalid brand"),

  body("price")
    .optional()
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be greater than or equal to 0"),

  body("stock")
    .optional()
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),

  body("barcode")
    .optional()
    .optional()
    .trim()
    .isLength({ min: 6, max: 50 })
    .withMessage("Barcode must be between 6 and 50 characters"),

  body("tags").optional().isString().withMessage("Invalid tags"),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Invalid product status"),

  body("visibility")
    .optional()
    .isIn(["public", "private"])
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
  body("mrp").optional().isNumeric().withMessage("mrp must be a number"),
  body("stock").optional().isNumeric().withMessage("stock must be a number"),
  body("attributes").optional().isObject().withMessage("Invalid attributes"),
  body("options")
    .optional()
    .custom((value, { req }) => {
      let parsedValue = value;

      // 1. If it's a string, clean up broken client-side single quotes
      if (typeof parsedValue === "string") {
        try {
          // Removes single quotes immediately surrounding brackets: :'[' to :[ and ]' to ]
          let cleaned = parsedValue
            .replace(/:\s*['"`](\s*\[.*?\]\s*)['"`]/g, ":$1")
            .trim();

          parsedValue = JSON.parse(cleaned);
        } catch (e) {
          throw new Error("Options field contains invalid JSON formatting");
        }
      }

      // 2. Ensure the top-level structure resolved to an array
      if (!Array.isArray(parsedValue)) {
        throw new Error("Options must be an array structure");
      }

      // 3. Inspect inner objects safely
      parsedValue.forEach((val: any) => {
        if (!val || typeof val !== "object") {
          throw new Error("Invalid option item format");
        }
        if (!val.name || !val.values) {
          throw new Error("Option name and values are required");
        }

        // Ensure values field within the object is a valid array
        let internalValues = val.values;
        if (typeof internalValues === "string") {
          try {
            internalValues = JSON.parse(internalValues);
          } catch (e) {
            throw new Error(`Invalid values array for option: ${val.name}`);
          }
        }

        if (!Array.isArray(internalValues)) {
          throw new Error(`Values property for '${val.name}' must be an array`);
        }

        // Save the cleaned inner array back
        val.values = internalValues;
      });

      // 4. Overwrite request body with clean JavaScript objects
      req.body.options = parsedValue;
      return true;
    }),
  checkExact([], { message: "Unknown fields are not allowed" }), // Checks for extra properties
  validate,
];
export const getProductsValidator = [
  query("cat")
    .optional()
    .isString()
    .withMessage("Invalid category")
    .trim()
    .bail(),
  query("brand").optional().isString().withMessage("Invalid brand").trim(),
  query("search").optional().isLength({ min: 1, max: 100 }),
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("Uprice")
    .optional()
    .isNumeric()
    .notEmpty()
    .withMessage("upper price is required"),
  query("Lprice")
    .optional()
    .isNumeric()
    .notEmpty()
    .withMessage("lower price is required"),
  query("subCategory")
    .optional()
    .isString()
    .withMessage("Invalid subCategory")
    .trim()
    .notEmpty()
    .withMessage("subCategory is required"),
  query("sort")
    .optional()
    .isString()
    .withMessage("Invalid sort")
    .isIn(["newest", "oldest", "price:asc", "price:desc"])
    .withMessage("Invalid sort"),
  validate,
];
