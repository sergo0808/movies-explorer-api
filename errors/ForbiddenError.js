class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = 403;
  }
}

module.exports = ForbiddenError;
