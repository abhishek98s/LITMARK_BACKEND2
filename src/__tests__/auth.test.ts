import supertest from 'supertest';
import knex from '../config/knex.config';
import app from '../app';

import * as UserServices from '../entities/user/user.service';
import { UsersSeed } from '../seeds/users.seed';

const api = supertest(app);

describe('Authentication', () => {
  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 for empty email and password', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({})
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email is required.');
    });

    it('should return 400 check for missing email', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          password: 'password',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email is required.');
    });

    it('should return 400 check for email is string', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 111,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email must be string.');
    });

    it('should return 400 check for invalid email', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Email must be a valid email address.',
      );
    });

    it('should return 400 check for missing password', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password is required.');
    });

    it('should return 400 check for string', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
          password: 111,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password must be a string.');
    });

    it('should return 401 check for non existent user', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
          password: 'password',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User doesn\'t exist');
    });

    it('should return 400 for extra property', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
          password: 'password',
          extra: 'extra',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Extra properties are not allowed.');
    });

    describe('When user exits', () => {
      beforeAll(async () => {
        try {
          const { username, email, password } = UsersSeed[1];
          const user = {
            username,
            email,
            password,
            image_id: 0,
            isdeleted: false,
            role: 'normal',
            created_by: username,
            updated_by: username,
          };
          await UserServices.addUser({ ...user });
        } catch (err) {
          console.log((err as Error).message);
        }
      });

      it('should return 401 check for invalid credentials', async () => {
        const response = await api
          .post('/api/auth/login')
          .send({
            email: 'jhon@example.com',
            password: 'password',
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials.');
      });

      it('should return 200 check for valid credentials', async () => {
        const response = await api
          .post('/api/auth/login')
          .send({
            email: 'jhon@example.com',
            password: 'John123!',
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Login Successful.');
      });
    });
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 for empty username, email, and password', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({})
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username is required.');
    });

    it('should return 400 for empty username', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username is required.');
    });

    it('should return 400 for username must be a string', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 123,
          email: 'test@example.com',
          password: 'password123',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Username must be string.');
    });

    it('should return 400 for missing password', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'test@example.com' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password is required.');
    });

    it('should return 400 for empty password', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'test@example.com', password: '' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password cannot be empty.');
    });

    it('should return 400 for password must be 8 characters long', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'short',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Password must be at least 8 characters long.',
      );
    });

    it('should return 400 for password must be a string', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 12345678,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Password must be a string.');
    });

    it('should return 400 for invalid password', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'invalid',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Password must be at least 8 characters long.',
      );
    });

    it('should return 400 for missing email', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'Password123!' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email is required.');
    });

    it('should return 400 for empty email', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', email: '', password: 'Password123!' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Email cannot be empty.');
    });

    it('should return 400 for invalid email', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'invalid-email',
          password: 'Password123!',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        'Email must be a valid email address.',
      );
    });

    describe('When user exits', () => {
      const { username, email, password } = UsersSeed[0];

      beforeAll(async () => {
        try {
          const user = {
            username,
            email,
            password,
            image_id: 0,
            isdeleted: false,
            role: 'normal',
            created_by: username,
            updated_by: username,
          };
          await UserServices.addUser({ ...user });
        } catch (err) {
          console.log((err as Error).message);
        }
      });

      it('should return 409 for email already exists', async () => {
        const response = await api
          .post('/api/auth/register')
          .send({
            username,
            email,
            password,
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Email already exists.');
      });

      it('should return 200 for successful operation', async () => {
        const response = await api
          .post('/api/auth/register')
          .send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'Newuser123!',
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Registration Successful.');
      });
    });
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await knex.destroy();
  });
});
