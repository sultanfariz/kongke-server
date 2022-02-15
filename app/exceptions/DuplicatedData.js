function DuplicatedDataError(message) {
  this.code = 409;
  this.name = 'DuplicatedDataError';
  this.message = message || 'The data already in database!';
  this.stack = new Error().stack;
}

DuplicatedDataError.prototype = Object.create(Error.prototype);
DuplicatedDataError.prototype.constructor = DuplicatedDataError;

module.exports = DuplicatedDataError;
