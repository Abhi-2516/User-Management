const express = require('express');
const router = express.Router();

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');

const {
  validate,
  createUserRules,
  updateUserRules,
  validateUserIdRules
} = require('../middleware/validate');

// Route: /api/users
router
  .route('/')
  .post(createUserRules, validate, createUser)
  .get(getAllUsers);

// Route: /api/users/:id
router
  .route('/:id')
  .get(validateUserIdRules, validate, getUserById)
  .patch(validateUserIdRules, updateUserRules, validate, updateUser)
  .delete(validateUserIdRules, validate, deleteUser);

module.exports = router;
