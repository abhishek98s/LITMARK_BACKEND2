import supertest from 'supertest';
import knex from '../config/knex.config';
import app from '../app';
import { authExceptionMessages } from '../auth/constant/authExceptionMessages';
import { UserSeed } from '../seeds/2_users';
import { folderExceptionMessages } from '../entities/folder/constant/folderExceptionMessages';

const api = supertest(app);

describe('Folder Entity', () => {
  const { email, password } = UserSeed[0];

  let token: string;

  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
  });

  beforeEach(async () => {
    if (
      // @ts-expect-error this
      this.currentTest.title ==
      'should return 200 and an empty array when no folders are available'
    ) {
      return;
    }

    await knex.seed.run({ directory: 'src/seeds' });
    const response = await api.post('/api/auth/login').send({
      email,
      password,
    });

    token = await response.body.data;
  });

  describe('GET /api/folder/sort', () => {
    it('should return 401 for token not sent', async () => {
      const response = await api.get('/api/folder/sort');
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: authExceptionMessages.ACCESS_DENIED,
      });
    });

    it('should return 403 for token not valid', async () => {
      const response = await api
        .get('/api/folder/sort')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(403);
      expect(response.body).toMatchObject({
        success: false,
        message: authExceptionMessages.TOKEN_INVALID,
      });
    });

    describe('User is authenticated', () => {
      it('should return 400 for missing query parameters', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.SORT_REQUIRED,
        });
      });

      it('should return 400 for missing sort query parameter', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ order: 'asc' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.SORT_REQUIRED,
        });
      });

      it('should return 400 for invalid sort query parameters', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'invalid_sort', order: 'asc' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.SORT_INVALID,
        });
      });
      it('should return 400 for empty sort query parameter', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: '', order: 'asc' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.SORT_INVALID,
        });
      });

      it('should return 400 for invalid sort format', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 11, order: 'asc' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.SORT_INVALID,
        });
      });

      it('should return 400 for missing order query parameter', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.ORDER_REQUIRED,
        });
      });

      it('should return 400 for invalid order query parameters', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date', order: 'invalid_sort' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.ORDER_INVALID,
        });
      });
      it('should return 400 for empty order query parameter', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date', order: '' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.ORDER_INVALID,
        });
      });

      it('should return 400 for invalid order format', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date', order: 11 });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.ORDER_INVALID,
        });
      });

      it('should return 400 for missing folder_id query parameter', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date', order: 'asc' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.FOLDER_ID_REQUIRED,
        });
      });

      it('should return 400 for invalid folder_id query parameters', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date', order: 'asc', folder_id: 'asdasd' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.FOLDER_ID_NUMBER,
        });
      });

      it('should return 400 for empty folder_id query parameter', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date', order: 'desc', folder_id: '' });
        expect(response.status).toBe(400);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.FOLDER_ID_NUMBER,
        });
      });

      it('should return 404 for folder that doesnot exits', async () => {
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date', order: 'desc', folder_id: 23 });
        expect(response.status).toBe(404);
        expect(response.body).toMatchObject({
          success: false,
          message: folderExceptionMessages.FOLDER_NOT_FOUND,
        });
      });

      it('should return 200 for sorted list of folders by date', async () => {
        const folderId = 1;
        const response = await api
          .get('/api/folder/sort')
          .set('Authorization', `Bearer ${token}`)
          .query({ sort: 'date', order: 'asc', folder_id: folderId });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length > 0).toBe(true);
        expect(response.body.data[0]).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          image_url: expect.any(String),
        });
      });
    });
  });

  describe('GET /api/folder/', () => {
    it('should return 401 for token not sent', async () => {
      const response = await api.get('/api/folder');
      expect(response.status).toBe(401);
      expect(response.body).toMatchObject({
        success: false,
        message: authExceptionMessages.ACCESS_DENIED,
      });
    });

    it('should return 403 for token not valid', async () => {
      const response = await api
        .get('/api/folder')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(403);
      expect(response.body).toMatchObject({
        success: false,
        message: authExceptionMessages.TOKEN_INVALID,
      });
    });
    describe('User is authenticated', () => {
      it('should return 200 and an array of folders', async () => {
        const response = await api
          .get('/api/folder/')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
        // Additional checks can be added to verify the structure of folders
      });
      // should return 200 and an array of folders
      // should return 200 and an empty array when no folders are available
    });
  });

  describe('GET /api/folder/:id', () => {});

  describe('POST /api/folder/', () => {});

  describe('PATCH /api/folder/:id', () => {});

  describe('DELETE /api/folder/:id', () => {});

  afterAll(async () => {
    await knex.migrate.rollback();
  });
});
