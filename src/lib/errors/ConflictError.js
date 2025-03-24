class ConflictError extends Error {
  constructor(fieldName) {
    super(`This ${fieldName} already exists.`);
    this.name = 'ConflictError';
    this.code = 422;
  }
}

export default ConflictError;
