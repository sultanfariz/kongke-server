// const { isEmpty, response, hashPassword } = require('../helpers/bcrypt');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const { User } = require('../../database/models');
// const ResetPassword = require('../models/ResetPassword');
// const { generateAccessToken } = require('../helpers/jwt');
const { DuplicatedDataError } = require('../exceptions');

module.exports = {
  register: async (req, res) => {
    const { username, password } = req.body;

    try {
      const isExist = await User.findOne({
        where: { username },
      });

      if (isExist.id) throw new DuplicatedDataError('Username already exist');

      const user = await User.create({
        username,
        password,
      });

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
        message: error.message,
      });
    }

  },
  login: async (req, res) => {
    const { username, password } = req.body;
    let token;
    let client;

    // try {
    //   let user = await User.findOne({ email });

    //   if (!isEmpty(user)) {
    //     if (!user.verifiedAt)
    //       throw new WrongIdentityError('Please verify your email first!');
    //     const checkPassword = await bcrypt.compare(password, user.password);
    //     if (!checkPassword)
    //       throw new WrongPasswordError(
    //         "Username or password doesn't match our records!"
    //       );
    //     // prevent password to be shown in response
    //     user.password = undefined;
    //     user = JSON.parse(JSON.stringify(user));

    //     const mitra = await Mitra.findOne({ user });
    //     const customer = await Customer.findOne({ user });

    //     // create new jwt token
    //     if (!isEmpty(mitra)) {
    //       token = generateAccessToken({
    //         id: user._id,
    //         idMitra: mitra._id,
    //         email: user.email,
    //         role: user.role,
    //       });
    //       client = { user, mitra };
    //     } else if (!isEmpty(customer)) {
    //       token = generateAccessToken({
    //         id: user._id,
    //         idCustomer: customer._id,
    //         email: user.email,
    //         role: user.role,
    //       });
    //       client = { user, customer };
    //     } else {
    //       throw new NotFoundError("User doesn't exists!");
    //     }
    //   } else if (!isEmpty(admin)) {
    //     const checkAdminPassword = await bcrypt.compare(
    //       password,
    //       admin.password
    //     );
    //     if (!checkAdminPassword)
    //       throw new WrongPasswordError(
    //         'Your password does not match with our records!'
    //       );
    //     // create new jwt token
    //     token = generateAccessToken({
    //       idAdmin: admin._id,
    //       email: admin.email,
    //       role: 'admin',
    //     });
    //     admin.role = 'admin';
    //     // prevent password to be shown in response
    //     admin.password = undefined;
    //     admin = JSON.parse(JSON.stringify(admin));
    //     client = { admin };
    //   } else throw new NotFoundError("Username or password doesn't match our records!");

    //   // store the token in user browser cookie
    //   res.cookie('token', token, { httpOnly: true });
    //   return response(res, {
    //     code: 200,
    //     success: true,
    //     message: 'Login successfully!',
    //     content: { client, token },
    //   });
    // } catch (error) {
    //   if (
    //     error.name === 'NotFoundError' ||
    //     error.name === 'WrongPasswordError' ||
    //     error.name === 'WrongIdentityError'
    //   ) {
    //     return response(res, {
    //       code: 400,
    //       success: false,
    //       message: error.message,
    //     });
    //   }

    //   return response(res, {
    //     code: 500,
    //     success: false,
    //     message: error.message || 'Something went wrong',
    //     content: error,
    //   });
    // }
  },
  logout: async (req, res) => {
    res.status(202).clearCookie('token');
    return response(res, {
      code: 202,
      success: true,
      message: 'Cookie has been cleared',
    });
  },
};
