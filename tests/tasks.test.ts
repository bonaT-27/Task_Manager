import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';

describe('Tasks API', () => {
  let authToken: string;

  beforeEach(async () => {
    // Clean database
    await prisma.task.deleteMany();
    await prisma.user.deleteMany();

    // Wait for deletion
    await new Promise(resolve => setTimeout(resolve, 100));

    // Register a user with unique email
    const registerRes = await request(app)
      .post('/api/auth/register')
      .send({
        email: `taskuser_${Date.now()}@example.com`,
        password: 'password123',
        name: 'Task User',
      });

    authToken = registerRes.body.token;
    
    // Wait for user to be fully created
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verify we have a token
    if (!authToken) {
      throw new Error('Failed to get auth token');
    }
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      // Ensure we have a valid token
      expect(authToken).toBeDefined();
      
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Task',
          description: 'This is a test task',
          priority: 'HIGH',
        });

      console.log('Create task response:', res.body);
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe('Test Task');
      expect(res.body.data.status).toBe('PENDING');
      expect(res.body.data.priority).toBe('HIGH');
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Missing title',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation error');
    });

    it('should require authentication', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({
          title: 'Test Task',
          priority: 'HIGH',
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('No token provided');
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      // Create tasks using the API
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Task 1', priority: 'HIGH' });
      
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Task 2', priority: 'MEDIUM' });
      
      // Wait for tasks to be created
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should get all tasks for authenticated user', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`);

      console.log('Get tasks response:', res.body);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
    });

    it('should not get tasks without authentication', async () => {
      const res = await request(app).get('/api/tasks');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Specific Task', priority: 'HIGH' });
      
      taskId = createRes.body.data.id;
    });

    it('should get task by id', async () => {
      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      console.log('Get task by ID response:', res.body);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(taskId);
      expect(res.body.data.title).toBe('Specific Task');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .get('/api/tasks/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toBe('Task not found');
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Update Task', priority: 'MEDIUM' });
      
      taskId = createRes.body.data.id;
    });

    it('should update task', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Updated Title',
          status: 'IN_PROGRESS',
        });

      console.log('Update task response:', res.body);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.status).toBe('IN_PROGRESS');
    });

    it('should validate update data', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          status: 'INVALID_STATUS',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation error');
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let taskId: string;

    beforeEach(async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Delete Task', priority: 'LOW' });
      
      taskId = createRes.body.data.id;
    });

    it('should delete task', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(204);

      // Verify task is deleted
      const getRes = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(getRes.status).toBe(404);
    });
  });

  describe('GET /api/tasks/status/:status', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Pending Task', priority: 'HIGH' });

      const completedRes = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Completed Task', priority: 'MEDIUM' });
      
      await request(app)
        .patch(`/api/tasks/${completedRes.body.data.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ status: 'COMPLETED' });
      
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should get tasks by status', async () => {
      const res = await request(app)
        .get('/api/tasks/status/PENDING')
        .set('Authorization', `Bearer ${authToken}`);

      console.log('Get tasks by status response:', res.body);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].status).toBe('PENDING');
    });
  });

  describe('GET /api/tasks/priority/:priority', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'High Priority Task', priority: 'HIGH' });

      await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Medium Priority Task', priority: 'MEDIUM' });
      
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    it('should get tasks by priority', async () => {
      const res = await request(app)
        .get('/api/tasks/priority/HIGH')
        .set('Authorization', `Bearer ${authToken}`);

      console.log('Get tasks by priority response:', res.body);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].priority).toBe('HIGH');
    });
  });
});