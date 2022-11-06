class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = 401;
  }
}

module.exports = UnauthorizedError;
