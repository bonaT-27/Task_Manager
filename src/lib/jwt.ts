import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-me-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const generateToken = (userId: string): string => {
  const payload = { userId };
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
  };
  
  const token = jwt.sign(payload, JWT_SECRET, options);
  console.log('Generated token for user:', userId); // Debug log
  return token;
};

export const verifyToken = (token: string): { userId: string } => {
  try {
    console.log('Verifying token:', token); // Debug log
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Decoded token:', decoded); // Debug log
    return decoded as { userId: string };
  } catch (error) {
    console.error('Token verification failed:', error);
    throw new Error('Invalid or expired token');
  }
};