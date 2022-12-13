export const settings = {
  JWT_SECRET: process.env.JWT_SECRET || '123',
  JWT_SECRET_REFRESH: process.env.JWT_SECRET || 'refresh_jwt_token_pass',
  JWT_SECRET_PASSWORD_RECOVERY: process.env.JWT_SECRET_PASSWORD_RECOVERY || 'passwordRecovery_jwt_token_pass',
}
