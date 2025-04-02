import supertest from 'supertest';
import knex from '../config/knex.config';
import app from '../app';

import * as UserServices from '../entities/user/user.service';
import { UsersSeed } from '../seeds/users.seed';

const api = supertest(app);

describe('Authentication', () => {
  beforeAll(async () => {
    await knex.migrate.latest();
  });

  describe('POST /login', () => {
    it('should return 400 for empty email and password', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({})
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      console.log(response.body);
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
      expect(response.body.message).toBe('Email must be a string.');
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
        const { username, email, password } = UsersSeed[0];
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

  describe('POST /register', () => {
    // should return 400 for empty username, email, password
    // should return 400 for missing username
    // should return 400 for missing email
    // should return 400 for missing password
    // should return 400 for username length less thatn 3
    // should return 400 for invalid email
    // should return 400 for invalid password
    // should return 409 for email already exists
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await knex.destroy();
  });
});
