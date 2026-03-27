import { body, param, validationResult } from "express-validator";

// Validation result handler - returns 400 if validation fails
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }
  next();
};

// Auth validation rules
export const validateRegister = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be 3-30 characters")
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage("Username can only contain letters, numbers, underscores, and hyphens"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage("Password must contain uppercase, lowercase, and number"),
  handleValidationErrors
];

export const validateLogin = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  handleValidationErrors
];

// Conversation validation
export const validateCreateConversation = [
  body("receiverId")
    .trim()
    .isMongoId()
    .withMessage("Invalid receiver ID"),
  handleValidationErrors
];

// Message validation
export const validateSendMessage = [
  body("conversationId")
    .trim()
    .isMongoId()
    .withMessage("Invalid conversation ID"),
  body("text")
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage("Message must be 1-5000 characters"),
  handleValidationErrors
];

// Param validation for conversationId
export const validateConversationId = [
  param("conversationId")
    .isMongoId()
    .withMessage("Invalid conversation ID"),
  handleValidationErrors
];
