export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'default-secret-change-me-in-production',
  expiresIn: (process.env.JWT_EXPIRES_IN || '7d') as string,
  issuer: 'task-management-api',
  audience: 'task-management-api-users',
} as const;
