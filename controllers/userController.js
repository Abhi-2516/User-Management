const User = require('../models/User');

/**
 * @desc    Create a new user
 * @route   POST /api/users
 * @access  Public
 */
const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    // Check if user already exists with the normalized email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'A user with this email address already exists'
      });
    }

    // Create and save new user (pre-save hook handles bcrypt password hashing)
    const user = new User({
      fullName,
      email,
      password
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve all users
 * @route   GET /api/users
 * @access  Public
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      count: users.length,
      data: users.map((user) => user.toJSON())
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve a single user by ID
 * @route   GET /api/users/:id
 * @access  Public
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing user by ID (fullName, email, password)
 * @route   PATCH /api/users/:id
 * @access  Public
 */
const updateUser = async (req, res, next) => {
  try {
    const { fullName, email, password } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check email uniqueness if email is being updated
    if (email && email.toLowerCase() !== user.email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });

      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: 'A user with this email address already exists'
        });
      }
      user.email = email;
    }

    if (fullName !== undefined) {
      user.fullName = fullName;
    }

    if (password !== undefined) {
      user.password = password; // Trigger pre-save hashing
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user.toJSON()
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a user by ID
 * @route   DELETE /api/users/:id
 * @access  Public
 */
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: req.params.id
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
