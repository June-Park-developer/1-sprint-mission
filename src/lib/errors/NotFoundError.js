class NotFoundError extends Error {
  constructor(modelName, data) {
    super(`${modelName} with ${data} not found`);
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
