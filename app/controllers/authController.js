const { checkPassword, hashPassword } = require('../helpers/bcrypt');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { User } = require('../../database/models');
const { generateAccessToken } = require('../helpers/jwt');
const { DuplicatedDataError, NotFoundError, WrongPasswordError } = require('../exceptions');

module.exports = {
  register: async (req, res) => {
    const { username, password } = req.body;

    try {
      const isExist = await User.findOne({ where: { username } });

      if (isExist?.id) throw new DuplicatedDataError('Username already exist');

      const passwordHash = await hashPassword(password);

      const user = await User.create({
        username,
        password: passwordHash,
      });

      user.password = undefined;
      user.deletedAt = undefined;

      return res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error.code !== 500) {
        return res.status(error.code).json({
          status: 'error',
          message: error.message,
        });
      }

      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      let user = await User.findOne({ where: { username } });
      if (!user) throw new NotFoundError('User not found');

      const isMatch = await checkPassword(password, user.password);
      if (!isMatch) throw new WrongPasswordError('Wrong password');

      const token = generateAccessToken({
        id: user.id,
        username: user.username,
      });

      user.password = undefined;
      user.deletedAt = undefined;

      // store the token in user browser cookie
      res.cookie('token', token, { httpOnly: true });

      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user,
        },
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        status: 'error',
        message: 'Something went wrong',
      });
    }
  },
  logout: async (req, res) => {
    res.status(202).clearCookie('token');
    return res.status(202).json({
      status: 'success',
      message: 'Logout successfully',
    });
  },
};
