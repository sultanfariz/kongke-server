const bcrypt = require('bcrypt');

module.exports = {
  hashPassword: async data => {
    const password = await bcrypt.hash(data, 16);

    return password;
  },
  checkPassword(password, hash) {
    return bcrypt.compare(password, hash);
  },
};
