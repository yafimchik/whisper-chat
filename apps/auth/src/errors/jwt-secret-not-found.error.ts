const JWT_SECRET_NOT_FOUND_ERROR = 'JWT secret was not founded in environment variables!';

export default class JwtSecretNotFoundError extends Error {
  constructor(message: string = JWT_SECRET_NOT_FOUND_ERROR) {
    super(message);
  }
}
