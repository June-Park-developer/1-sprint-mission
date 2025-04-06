export class ConflictError extends Error {
  constructor(fieldName: string) {
    super(`This ${fieldName} already exists.`);
    this.name = 'ConflictError';
  }
}
