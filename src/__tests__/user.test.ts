import supertest from 'supertest';
import knex from '../config/knex.config';
import app from '../app';
import { authExceptionMessages } from '../auth/constant/authExceptionMessages';
import { UsersSeed } from '../seeds/users.seed';
import { userExceptionMessages } from '../entities/user/constant/userExceptionMessages';

const api = supertest(app);

describe('User Entitity', () => {
  const { username, email, password } = UsersSeed[0];
  const {
    username: username2,
    email: email2,
    password: password2,
  } = UsersSeed[1];

  let token: string;

  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();

    await api.post('/api/auth/register').send({
      username,
      email,
      password,
    });

    await api.post('/api/auth/register').send({
      username2,
      email2,
      password2,
    });

    const response = await api.post('/api/auth/login').send({
      email,
      password,
    });

    token = await response.body.data;
  });

  describe('GET /api/user/:id', () => {
    it('should return 401 for token not sent', async () => {
      const response = await api.get('/api/user/1');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.ACCESS_DENIED);
    });

    it('should return 401 for token not valid', async () => {
      const response = await api
        .get('/api/user/1')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.TOKEN_INVALID);
    });

    describe('User is authenticated', () => {
      it('should return 400 for invalid user id format', async () => {
        const invalidUserId = 'invalid_id';
        const response = await api
          .get(`/api/user/${invalidUserId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(userExceptionMessages.INVALID_ID);
      });

      it('should return 404 for id not provided', async () => {
        const response = await api
          .get('/api/user/')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.ROUTE_NOT_EXISTS,
        );
      });

      it('should return 404 for user not found', async () => {
        const response = await api
          .get('/api/user/9999')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.message).toBe(
          userExceptionMessages.USER_NOT_FOUND,
        );
      });

      it('should return 200 for expected format', async () => {
        const userId = 1;
        const response = await api
          .get(`/api/user/${userId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          success: true,
          data: {
            id: userId,
            username: expect.any(String),
            email: expect.any(String),
            image_id: expect.any(Number),
          },
        });
      });
    });
  });

  describe('PATCH /api/user/:id', () => {
    it('should return 401 for token not sent', async () => {
      const response = await api.patch('/api/user/1');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.ACCESS_DENIED);
    });

    it('should return 401 for token not valid', async () => {
      const response = await api
        .patch('/api/user/1')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.TOKEN_INVALID);
    });

    describe('User is authenticated', () => {
      it('should return 400 for missing username', async () => {
        const response = await api
          .patch('/api/user/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ password });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.USERNAME_REQUIRED,
        );
      });

      it('should return 400 for empty username', async () => {
        const response = await api
          .patch('/api/user/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ username: '', password });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.USERNAME_EMPTY,
        );
      });

      it('should return 400 for number type username', async () => {
        const response = await api
          .patch('/api/user/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ username: 12345, password });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.USERNAME_STRING,
        );
      });

      it('should return 400 for missing password', async () => {
        const response = await api
          .patch('/api/user/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ username });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.PASSWORD_REQUIRED,
        );
      });

      it('should return 400 for empty password', async () => {
        const response = await api
          .patch('/api/user/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ username, password: '' });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.PASSWORD_EMPTY,
        );
      });

      it('should return 400 for number type password', async () => {
        const response = await api
          .patch('/api/user/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ username, password: 12345678 });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.PASSWORD_STRING,
        );
      });

      it('should return 400 for invalid format password', async () => {
        const response = await api
          .patch('/api/user/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ username, password: 'short1111' });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.PASSWORD_INVALID,
        );
      });

      it('should return 400 for less than 8 length password', async () => {
        const response = await api
          .patch('/api/user/1')
          .set('Authorization', `Bearer ${token}`)
          .send({ username, password: 'short' });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.PASSWORD_SHORT,
        );
      });

      it('should return 404 for id not provided', async () => {
        const response = await api
          .patch('/api/user/')
          .set('Authorization', `Bearer ${token}`)
          .send({ username, password: 'ValidUsername123!' });
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.ROUTE_NOT_EXISTS,
        );
      });

      it('should return 400 for invalid user id format', async () => {
        const response = await api
          .patch('/api/user/invalid-id-format')
          .set('Authorization', `Bearer ${token}`)
          .send({ username, password });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(userExceptionMessages.INVALID_ID);
      });

      it('should return 404 for user not found', async () => {
        const response = await api
          .patch('/api/user/1234567890') // Assuming this ID does not exist
          .set('Authorization', `Bearer ${token}`)
          .send({ username, password });

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          userExceptionMessages.USER_NOT_FOUND,
        );
      });
    });
  });

  describe('DELETE /api/user/:id', () => {
    it('should return 401 for token not sent', async () => {
      const response = await api.delete('/api/user/1');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.ACCESS_DENIED);
    });

    it('should return 401 for token not valid', async () => {
      const response = await api
        .delete('/api/user/1')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.TOKEN_INVALID);
    });

    describe('User is authenticated', () => {
      it('should return 400 for invalid ID', async () => {
        const response = await api
          .delete('/api/user/invalid_id') // Invalid ID format
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(userExceptionMessages.INVALID_ID);
      });

      it('should return 404 for ID not given', async () => {
        const response = await api
          .delete('/api/user/') // No ID provided
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.ROUTE_NOT_EXISTS,
        );
      });

      it('should return 404 for user not found', async () => {
        const response = await api
          .delete('/api/user/9999')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          userExceptionMessages.USER_NOT_FOUND,
        );
      });
    });
  });
  describe('POST /api/user', () => {});

  afterAll(async () => {
    await knex.migrate.rollback();
  });
});
