const { User } = require('../../database/models');
const { NotFoundError } = require('../exceptions');

/**
 * Get all users
 * @returns {object} users
 */
const getUsers = async () => {
  try {
    const users = await User.findAll();
    return users;
  } catch (error) {
    return error;
  }
};

/**
 * Get user by id
 * @param {uint} userId
 * @returns {object} user
 */
const getUserById = async (userId) => {
  try {
    const user = await Users.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');
    return user;
  } catch (error) {
    return error;
  }
};

/**
 * Get user by username
 * @param {string} username 
 * @returns {object} user
 */
const getUserByUsername = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new NotFoundError('User not found');
    return user;
  } catch (error) {
    return error;
  }
};

/**
 * Create a new user
 * @param {{username: string, password: string }} createUserDto
 * @returns {object} user
 */
const createUser = async (createUserDto) => {
  try {
    return await User.create(createUserDto);
  } catch (error) {
    return error;
  }
};

/**
 * Update user password by id
 * @param {string} username 
 * @param {string} updatePasswordDto 
 * @returns 
 */
const updatePassword = async (username, updatePasswordDto) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) throw new NotFoundError('User not found');
    await user.update(updatePasswordDto);
    return user;
  } catch (error) {
    return error;
  }
};

/**
 * Delete user by id
 * @param {uint} userId
 * @returns {object} user
 */
const deleteUser = async (userId) => {
  try {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundError('User not found');
    await user.destroy();
    return user;
  } catch (error) {
    return error;
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByUsername,
  createUser,
  updatePassword,
  deleteUser,
};
