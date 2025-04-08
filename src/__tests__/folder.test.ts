import supertest from 'supertest';
import knex from '../config/knex.config';
import app from '../app';
import { authExceptionMessages } from '../auth/constant/authExceptionMessages';
import { UserSeed } from '../seeds/2_users';
import { folderExceptionMessages } from '../entities/folder/constant/folderExceptionMessages';
import { folderSuccessMessages } from '../entities/folder/constant/folderSuccessMessages';

const api = supertest(app);

describe('Folder Entity', () => {
  const { email, password } = UserSeed[0];

  let token: string;

  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
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
      describe('When folder is empty', () => {
        beforeEach(async () => {
          await knex.migrate.rollback();
          await knex.migrate.latest();
        });

        it('should return 200 and empty array of folders', async () => {
          const response = await api
            .get('/api/folder/')
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
          expect(Array.isArray(response.body.data)).toBe(true);
          expect(response.body.data.length).toBe(0);
        });
      });

      describe('When folder is added', () => {
        beforeAll(async () => {
          await knex.migrate.rollback();
          await knex.migrate.latest();

          await knex.seed.run({ directory: 'src/seeds' });
        });
        it('should return 200 and an array of folders', async () => {
          const response = await api
            .get('/api/folder/')
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
          expect(Array.isArray(response.body.data)).toBe(true);
          expect(response.body.data[0]).toMatchObject({
            id: expect.any(Number),
            name: expect.any(String),
            image_id: expect.any(Number),
            user_id: expect.any(Number),
            folder_id: null,
            image_url: expect.any(String),
          });
        });
      });
    });
  });

  describe('GET /api/folder/:id', () => {
    it('should return 401 for token not sent', async () => {
      const response = await api.get('/api/folder/1');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.ACCESS_DENIED);
    });

    it('should return 401 for token not valid', async () => {
      const response = await api
        .get('/api/folder/1')
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.TOKEN_INVALID);
    });

    describe('User is authenticated', () => {
      const folderId = 1;

      it('should return 400 for a invalid folder ID', async () => {
        const response = await api
          .get('/api/folder/invalid_id')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(folderExceptionMessages.INVALID_ID);
      });

      it('should return 404 for a non-existent folder ID', async () => {
        const response = await api
          .get('/api/folder/99999')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          folderExceptionMessages.FOLDER_NOT_FOUND,
        );
      });
      it('should return 200 and the folder details for a valid ID', async () => {
        const response = await api
          .get(`/api/folder/${folderId}`)
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data[0]).toMatchObject({
          id: expect.any(Number),
          name: expect.any(String),
          image_id: expect.any(Number),
          user_id: expect.any(Number),
          folder_id: expect.any(Number),
          image_url: expect.any(String),
        });
      });
    });
  });

  describe('POST /api/folder/', () => {
    it('should return 401 for token not sent', async () => {
      const response = await api.post('/api/folder/').send({
        name: 'New Folder',
        folder_id: null,
        user: {
          id: 1,
          username: 'testuser',
          email: 'testuser@example.com',
        },
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.ACCESS_DENIED);
    });

    it('should return 401 for token not valid', async () => {
      const response = await api
        .post('/api/folder/')
        .set('Authorization', 'Bearer invalid_token')
        .send({
          name: 'New Folder',
          folder_id: null,
          user: {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
          },
        });
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.TOKEN_INVALID);
    });

    describe('User is authenticated', () => {
      it('should return 400 if name is missing', async () => {
        const response = await api
          .post('/api/folder/')
          .set('Authorization', `Bearer ${token}`)
          .send({
            folder_id: null,
          });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          folderExceptionMessages.NAME_REQUIRED,
        );
      });

      it('should return 400 if folder_id is not a number', async () => {
        const response = await api
          .post('/api/folder/')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'New Folder',
            folder_id: 'not_a_number', // Invalid folder_id
          });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          folderExceptionMessages.FOLDER_ID_NUMBER,
        );
      });

      it('should return 400 if extra properties are included in the request body', async () => {
        const response = await api
          .post('/api/folder/')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'New Folder',
            folder_id: null,
            extraProperty: 'should not be here',
          });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          folderExceptionMessages.EXTRA_PROPERTY,
        );
      });

      it('should return 200 and create a new folder with valid data', async () => {
        const response = await api
          .post('/api/folder/')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'New Folder',
            folder_id: null,
          });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('name', 'New Folder');
      });
    });
  });

  describe('PATCH /api/folder/:id', () => {
    const folderId = 1;
    it('should return 401 for token not sent', async () => {
      const response = await api.patch(`/api/folder/${folderId}`).send({
        name: 'Updated Folder',
        user: {
          id: 1,
          username: 'testuser',
          email: 'testuser@example.com',
        },
      });
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.ACCESS_DENIED);
    });

    it('should return 401 for token not valid', async () => {
      const response = await api
        .patch(`/api/folder/${folderId}`)
        .set('Authorization', 'Bearer invalid_token')
        .send({
          name: 'Updated Folder',
          user: {
            id: 1,
            username: 'testuser',
            email: 'testuser@example.com',
          },
        });
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.TOKEN_INVALID);
    });

    describe('User is authenticated', () => {
      it('should return 400 if folder ID is invalid', async () => {
        const response = await api
          .patch('/api/folder/invalid_id')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Updated Folder',
          });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(folderExceptionMessages.INVALID_ID);
      });

      it('should return 400 if name is missing', async () => {
        const response = await api
          .patch(`/api/folder/${folderId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({});
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          folderExceptionMessages.NAME_REQUIRED,
        );
      });

      it('should return 400 if extra properties are included in the request body', async () => {
        const response = await api
          .patch(`/api/folder/${folderId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Updated Folder',
            extraProperty: 'should not be here', // Extra property
          });
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          folderExceptionMessages.EXTRA_PROPERTY,
        );
      });

      it('should return 404 if folder doesnot exists', async () => {
        const response = await api
          .patch('/api/folder/99999')
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Updated Folder',
          });
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          folderExceptionMessages.FOLDER_NOT_FOUND,
        );
      });

      it('should return 200 and update the folder with valid data', async () => {
        const response = await api
          .patch(`/api/folder/${folderId}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            name: 'Updated Folder',
          });
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('name', 'Updated Folder');
      });
    });
  });

  describe('DELETE /api/folder/:id', () => {
    const folderId = 1;
    it('should return 401 for token not sent', async () => {
      const response = await api.delete(`/api/folder/${folderId}`);
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.ACCESS_DENIED);
    });

    it('should return 401 for token not valid', async () => {
      const response = await api
        .delete(`/api/folder/${folderId}`)
        .set('Authorization', 'Bearer invalid_token');
      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.TOKEN_INVALID);
    });

    describe('User is authenticated', () => {
      it('should return 400 if folder ID is invalid', async () => {
        const response = await api
          .delete('/api/folder/invalid_id')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(folderExceptionMessages.INVALID_ID);
      });

      it('should return 404 if folder does not exist', async () => {
        const response = await api
          .delete('/api/folder/99999')
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          folderExceptionMessages.FOLDER_NOT_FOUND,
        );
      });

      it('should return 200 and delete the folder with valid ID', async () => {
        const response = await api
          .delete(`/api/folder/${folderId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
          folderSuccessMessages.DELETE_SUCCESS,
        );

        const checkResponse = await api
          .get(`/api/folder/${folderId}`)
          .set('Authorization', `Bearer ${token}`);
        expect(checkResponse.status).toBe(404);
      });
    });
  });

  afterAll(async () => {
    await knex.migrate.rollback();
  });
});
