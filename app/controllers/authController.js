const { checkPassword, hashPassword } = require('../helpers/bcrypt');
const { generateAccessToken } = require('../helpers/jwt');
const { DuplicatedDataError, NotFoundError, WrongPasswordError } = require('../exceptions');
const { getUserByUsername, createUser } = require('../repositories/userRepositories');

module.exports = {
  register: async (req, res) => {
    const { username, password } = req.body;

    try {
      const isExist = await getUserByUsername(username);

      if (isExist?.id) throw new DuplicatedDataError('Username already exist');

      const passwordHash = await hashPassword(password);

      const user = await createUser({ username, password: passwordHash });

      user.password = undefined;
      user.deletedAt = undefined;

      return res.status(201).json({
        status: 'success',
        data: user,
      });
    } catch (error) {
      if (error.code !== 500) {
        return res.status(error.code).json({
          status: 'failed',
          message: error.message,
        });
      }

      return res.status(500).json({
        status: 'failed',
        message: 'Something went wrong',
      });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      let user = await getUserByUsername(username);
      if (!user.username) throw new NotFoundError('User not found');

      const isMatch = await checkPassword(password, user.password);
      if (!isMatch) throw new WrongPasswordError('Wrong password');

      const token = generateAccessToken({
        id: user.id,
        username: user.username,
      });

      user.password = undefined;
      user.deletedAt = undefined;

      // store the token in user browser cookie
      res.cookie('jwt', token, { httpOnly: true });

      return res.status(200).json({
        status: 'success',
        data: {
          token,
          user,
        },
      });
    } catch (error) {
      if (error.code !== 500) {
        return res.status(error.code).json({
          status: 'failed',
          message: error.message,
        });
      }

      return res.status(500).json({
        status: 'failed',
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
