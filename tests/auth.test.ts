import { describe, it, expect } from 'vitest';
import request from 'supertest';
//import { app } from '../src/app';
import app from '../src/app'; 

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      });
    
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });
});