class ConflictError extends Error {
  constructor(fieldName) {
    super(`This ${fieldName} already exists.`);
    this.name = 'ConflictError';
  }
}

export default ConflictError;
