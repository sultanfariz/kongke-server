function WrongIdentityError(message) {
  this.code = 401;
  this.name = 'WrongIdentityError';
  this.message = message || 'Resources Not Found!';
  this.stack = new Error().stack;
}

WrongIdentityError.prototype = Object.create(Error.prototype);
WrongIdentityError.prototype.constructor = WrongIdentityError;

module.exports = WrongIdentityError;
