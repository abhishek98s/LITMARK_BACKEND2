import supertest from 'supertest';
import knex from '../config/knex.config';
import app from '../app';
import { authExceptionMessages } from '../auth/constant/authExceptionMessages';
import { UserSeed } from '../seeds/2_users';
import { bookmarkExceptionMessages } from '../entities/bookmark/constant/bookmarkExceptionMessages';
import { bookmarkSucessMessages } from '../entities/bookmark/constant/bookmarkSucessMessages';
import { chipExceptionMessages } from '../entities/chip/constant/chipExceptionMessages';

const api = supertest(app);

describe('Bookmark Enitity', () => {
  const { email, password } = UserSeed[0];

  let token: string;

  beforeEach(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run({ directory: 'src/seeds' });
    const response = await api.post('/api/auth/login').send({
      email,
      password,
    });

    token = await response.body.data;
  });

  describe('Recent Bookmark', () => {
    describe('GET api/bookmark/recent', () => {
      it('should return 401 for token not sent', async () => {
        const response = await api.get('/api/bookmark/recent');
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.ACCESS_DENIED,
        });
      });

      it('should return 403 for token not valid', async () => {
        const response = await api
          .get('/api/bookmark/recent')
          .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.TOKEN_INVALID,
        });
      });

      describe('User is authenticated', () => {
        it('should return 200 for recent bookmark array', async () => {
          const response = await api
            .get('/api/bookmark/recent')
            .set('Authorization', `Bearer ${token}`);

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
          expect(response.body.data.length > 0).toBe(true);
          expect(response.body.data[0]).toMatchObject({
            id: expect.any(Number),
            url: expect.any(String),
            image_id: expect.any(Number),
            folder_id: expect.any(Number),
            title: expect.any(String),
            date: expect.any(String),
          });
        });
        describe('When recent bookmark is empty', () => {
          beforeEach(async () => {
            await knex.migrate.rollback();
            await knex.migrate.latest();
          });
          it('should return 200 for empty recent bookmark array', async () => {
            const response = await api
              .get('/api/bookmark/recent')
              .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.length).toBe(0);
          });
        });
      });
    });
    describe('DELETE api/bookmark/recent/:id', () => {
      const bookmarkId = 1;
      const BASE_URL = '/api/bookmark/recent';

      it('should return 401 for token not sent', async () => {
        const response = await api.delete(`${BASE_URL}/${bookmarkId}`);
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.ACCESS_DENIED,
        });
      });

      it('should return 403 for token not valid', async () => {
        const response = await api
          .delete(`${BASE_URL}/${bookmarkId}`)
          .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.TOKEN_INVALID,
        });
      });

      describe('User is authenticated', () => {
        it('should return 400 for invlaid id', async () => {
          const response = await api
            .delete(`${BASE_URL}/asdasd`)
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.INVALID_ID,
          });
        });

        it('should return 404 for bookmark not exist', async () => {
          const response = await api
            .delete(`${BASE_URL}/9999`)
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(404);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.BOOKMARK_NOT_FOUND,
          });
        });

        it('should return 200 for successful deletion', async () => {
          const response = await api
            .delete(`${BASE_URL}/2`)
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            success: true,
            message: bookmarkSucessMessages.DELETE_RB_SUCESS,
          });

          const response2 = await api
            .get(`${BASE_URL}/2`)
            .set('Authorization', `Bearer ${token}`);
          expect(response2.status).toBe(404);
        });
      });
    });
    describe('PATCH api/bookmark/recent/:id', () => {
      const bookmarkId = 1;
      const BASE_URL = '/api/bookmark/recent';

      it('should return 401 for token not sent', async () => {
        const response = await api.patch(`${BASE_URL}/${bookmarkId}`);
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.ACCESS_DENIED,
        });
      });

      it('should return 403 for token not valid', async () => {
        const response = await api
          .patch(`${BASE_URL}/${bookmarkId}`)
          .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.TOKEN_INVALID,
        });
      });
      describe('User is authenticated', () => {
        it('should retun 400 for invalid id', async () => {
          const response = await api
            .patch(`${BASE_URL}/asd`)
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.INVALID_ID,
          });
        });

        it('should retun 400 for bookmark not found', async () => {
          const response = await api
            .patch(`${BASE_URL}/asd`)
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.INVALID_ID,
          });
        });

        it('should retun 200 for successful operation', async () => {
          const response = await api
            .patch(`${BASE_URL}/1`)
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(200);
          expect(response.body).toMatchObject({
            success: true,
            message: bookmarkSucessMessages.ADDED_RB_SUCESS,
          });
        });
      });
    });

    describe('GET api/bookmark/recent/sort', () => {
      it('should return 401 for token not sent', async () => {
        const response = await api.get('/api/bookmark/recent/sort');
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.ACCESS_DENIED,
        });
      });

      it('should return 403 for token not valid', async () => {
        const response = await api
          .get('/api/bookmark/recent/sort')
          .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.TOKEN_INVALID,
        });
      });

      describe('User  is authenticated', () => {
        it('should return 400 for missing sortBy', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ order: 'asc' }); // Missing sortBy

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.SORT_REQUIRED,
          });
        });

        it('should return 400 for invalid sortBy', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: 'invalid_field', order: 'asc' });

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.SORT_INVALID,
          });
        });

        it('should return 400 for empty sortBy', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: '', order: 'asc' }); // Empty sortBy

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.SORT_INVALID,
          });
        });

        it('should return 400 for invalid data format in sortBy', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: 123, order: 'asc' });

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.SORT_INVALID,
          });
        });

        it('should return 400 for missing order', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: 'date' });

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.ORDER_REQUIRED,
          });
        });

        it('should return 400 for invalid order', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: 'date', order: 'invalid_order' });

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.ORDER_INVALID,
          });
        });

        it('should return 400 for empty order', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: 'date', order: '' });

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.ORDER_INVALID,
          });
        });

        it('should return 400 for invalid data format in order', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: 'date', order: 123 });

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.ORDER_INVALID,
          });
        });

        it('should return 200 for successful operation', async () => {
          const response = await api
            .get('/api/bookmark/recent/sort')
            .set('Authorization', `Bearer ${token}`)
            .query({ sortBy: 'date', order: 'asc' });

          expect(response.status).toBe(200);
          expect(response.body.success).toBe(true);
          expect(response.body).toHaveProperty('data');
        });
      });
    });
    describe('GET api/bookmark/recent/filter', () => {
      it('should return 401 for token not sent', async () => {
        const response = await api.get('/api/bookmark/recent/filter');
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.ACCESS_DENIED,
        });
      });

      it('should return 403 for token not valid', async () => {
        const response = await api
          .get('/api/bookmark/recent/filter')
          .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.TOKEN_INVALID,
        });
      });

      describe('User authenticated', () => {
        it('should return 400 for empty body', async () => {
          const response = await api
            .get('/api/bookmark/recent/filter')
            .set('Authorization', `Bearer ${token}`)
            .send({});

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.CHIP_ID_REQUIRED,
          });
        });

        it('should return 400 for missing chip_id', async () => {
          const response = await api
            .get('/api/bookmark/recent/filter')
            .set('Authorization', `Bearer ${token}`)
            .send({}); // Missing chip_id

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.CHIP_ID_REQUIRED,
          });
        });

        it('should return 400 for empty chip_id', async () => {
          const response = await api
            .get('/api/bookmark/recent/filter')
            .set('Authorization', `Bearer ${token}`)
            .query({ chip_id: '' }); // Empty chip_id

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.CHIP_ID_NUMBER,
          });
        });

        it('should return 400 for chip_id not found', async () => {
          const response = await api
            .get('/api/bookmark/recent/filter')
            .set('Authorization', `Bearer ${token}`)
            .query({ chip_id: 9999 });

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: chipExceptionMessages.CHIP_NOT_FOUND,
          });
        });

        it('should return 200 for successful operation', async () => {
          const response = await api
            .get('/api/bookmark/recent/filter')
            .set('Authorization', `Bearer ${token}`)
            .query({ chip_id: 1 });

          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('data');
        });
      });
    });

    describe('GET /api/bookmark/recent/search', () => {
      it('should return 401 for token not sent', async () => {
        const response = await api.get('/api/bookmark/recent/search');
        expect(response.status).toBe(401);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.ACCESS_DENIED,
        });
      });

      it('should return 403 for token not valid', async () => {
        const response = await api
          .get('/api/bookmark/recent/search')
          .set('Authorization', 'Bearer invalid_token');
        expect(response.status).toBe(403);
        expect(response.body).toMatchObject({
          success: false,
          message: authExceptionMessages.TOKEN_INVALID,
        });
      });

      describe('User  is authenticated', () => {
        it('should return 400 for missing title', async () => {
          const response = await api
            .get('/api/bookmark/recent/search')
            .set('Authorization', `Bearer ${token}`);
          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.SEARCH_QUERY_EMPTY,
          });
        });

        it('should return 400 for empty title', async () => {
          const response = await api
            .get('/api/bookmark/recent/search')
            .set('Authorization', `Bearer ${token}`)
            .query({ title: '' }); // Empty title

          expect(response.status).toBe(400);
          expect(response.body).toMatchObject({
            success: false,
            message: bookmarkExceptionMessages.SEARCH_QUERY_EMPTY,
          });
        });

        it('should return 200 for successful search with valid title', async () => {
          const response = await api
            .get('/api/bookmark/recent/search')
            .set('Authorization', `Bearer ${token}`)
            .query({ title: 'd' });

          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('data');
        });

        it('should return 200 for successful search with no results', async () => {
          const response = await api
            .get('/api/bookmark/recent/search')
            .set('Authorization', `Bearer ${token}`)
            .query({ title: 'non_existent_title' });

          expect(response.status).toBe(200);
          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toEqual([]);
        });
      });
    });
  });

  describe('Bookmark', () => {
    // describe('GET api/bookmark/search', () => {
    //   it('should return 401 for token not sent', async () => {
    //     const response = await api.get('/api/bookmark/search');
    //     expect(response.status).toBe(401);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.ACCESS_DENIED,
    //     });
    //   });

    //   it('should return 403 for token not valid', async () => {
    //     const response = await api
    //       .get('/api/bookmark/search')
    //       .set('Authorization', 'Bearer invalid_token');
    //     expect(response.status).toBe(403);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.TOKEN_INVALID,
    //     });
    //   });

    //   describe('User is authenticated', () => {
    //     it('should return bookmarks based on search query', async () => {
    //       const response = await api
    //         .get('/api/bookmark/search')
    //         .query({ title: 'des' })
    //         .set('Authorization', `Bearer ${token}`); // Use a valid token

    //       expect(response.status).toBe(200);
    //       expect(response.body).toHaveProperty('data');
    //       // Add more assertions based on expected response
    //     });
    //   });
    // });

    // describe('GET api/bookmark/sort', () => {
    //   it('should return 401 for token not sent', async () => {
    //     const response = await api.get('/api/bookmark/sort');
    //     expect(response.status).toBe(401);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.ACCESS_DENIED,
    //     });
    //   });

    //   it('should return 403 for token not valid', async () => {
    //     const response = await api
    //       .get('/api/bookmark/sort')
    //       .set('Authorization', 'Bearer invalid_token');
    //     expect(response.status).toBe(403);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.TOKEN_INVALID,
    //     });
    //   });

    //   describe('User is authenticated', () => {
    //     it('should return sorted bookmarks for valid token', async () => {
    //       const response = await api
    //         .get('/api/bookmark/sort')
    //         .set('Authorization', `Bearer ${token}`); // Use a valid token

    //       expect(response.status).toBe(200);
    //       expect(response.body).toHaveProperty('bookmarks');
    //       // Add more assertions based on expected response
    //     });
    //   });
    // });

    // describe('GET api/bookmark', () => {
    //   it('should return 401 for token not sent', async () => {
    //     const response = await api.get('/api/bookmark');
    //     expect(response.status).toBe(401);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.ACCESS_DENIED,
    //     });
    //   });

    //   it('should return 403 for token not valid', async () => {
    //     const response = await api
    //       .get('/api/bookmark')
    //       .set('Authorization', 'Bearer invalid_token');
    //     expect(response.status).toBe(403);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.TOKEN_INVALID,
    //     });
    //   });

    //   describe('User is authenticated', () => {
    //     it('should return all bookmarks for authenticated user', async () => {
    //       const response = await api
    //         .get('/api/bookmark')
    //         .set('Authorization', `Bearer ${token}`); // Use a valid token

    //       expect(response.status).toBe(200);
    //       expect(response.body).toHaveProperty('bookmarks');
    //       // Add more assertions based on expected response
    //     });
    //   });
    // });

    // describe('GET api/bookmark/:folder_id', () => {
    //   it('should return 401 for token not sent', async () => {
    //     const response = await api.get('/api/bookmark/some_folder_id');
    //     expect(response.status).toBe(401);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.ACCESS_DENIED,
    //     });
    //   });

    //   it('should return 403 for token not valid', async () => {
    //     const response = await api
    //       .get('/api/bookmark/some_folder_id')
    //       .set('Authorization', 'Bearer invalid_token');
    //     expect(response.status).toBe(403);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.TOKEN_INVALID,
    //     });
    //   });

    //   describe('User  is authenticated', () => {
    //     it('should return bookmarks for a specific folder', async () => {
    //       const folderId = 'valid_folder_id'; // Replace with a valid folder ID
    //       const response = await api
    //         .get(`/api/bookmark/${folderId}`)
    //         .set('Authorization', `Bearer ${token}`); // Use a valid token

    //       expect(response.status).toBe(200);
    //       expect(response.body).toHaveProperty('bookmarks');
    //       // Add more assertions based on expected response
    //     });
    //   });
    // });

    // describe('POST api/bookmark', () => {
    //   it('should return 401 for token not sent', async () => {
    //     const response = await api.post('/api/bookmark');
    //     expect(response.status).toBe(401);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.ACCESS_DENIED,
    //     });
    //   });

    //   it('should return 403 for token not valid', async () => {
    //     const response = await api
    //       .post('/api/bookmark')
    //       .set('Authorization', 'Bearer invalid_token');
    //     expect(response.status).toBe(403);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.TOKEN_INVALID,
    //     });
    //   });

    //   describe('User  is authenticated', () => {
    //     it('should create a new bookmark', async () => {
    //       const newBookmark = {
    //         title: 'New Bookmark',
    //         url: 'http://example.com',
    //       };

    //       const response = await api
    //         .post('/api/bookmark')
    //         .set('Authorization', 'Bearer valid_token') // Use a valid token
    //         .send(newBookmark);

    //       expect(response.status).toBe(201);
    //       expect(response.body).toHaveProperty('bookmark');
    //       // Add more assertions based on expected response
    //     });
    //   });
    // });

    // describe('PATCH api/bookmark/:id', () => {
    //   it('should return 401 for token not sent', async () => {
    //     const response = await api.patch('/api/bookmark/some_bookmark_id');
    //     expect(response.status).toBe(401);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.ACCESS_DENIED,
    //     });
    //   });

    //   it('should return 403 for token not valid', async () => {
    //     const response = await api
    //       .patch('/api/bookmark/some_bookmark_id')
    //       .set('Authorization', 'Bearer invalid_token');
    //     expect(response.status).toBe(403);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.TOKEN_INVALID,
    //     });
    //   });

    //   describe('User  is authenticated', () => {
    //     it('should update an existing bookmark', async () => {
    //       const bookmarkId = 'valid_bookmark_id'; // Replace with a valid bookmark ID
    //       const updatedData = {
    //         title: 'Updated Bookmark Title',
    //       };

    //       const response = await api
    //         .patch(`/api/bookmark/${bookmarkId}`)
    //         .set('Authorization', 'Bearer valid_token') // Use a valid token
    //         .send(updatedData);

    //       expect(response.status).toBe(200);
    //       expect(response.body).toHaveProperty('bookmark');
    //       // Add more assertions based on expected response
    //     });
    //   });
    // });

    // describe('DELETE api/bookmark/:id', () => {
    //   it('should return 401 for token not sent', async () => {
    //     const response = await api.delete('/api/bookmark/some_bookmark_id');
    //     expect(response.status).toBe(401);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.ACCESS_DENIED,
    //     });
    //   });

    //   it('should return 403 for token not valid', async () => {
    //     const response = await api
    //       .delete('/api/bookmark/some_bookmark_id')
    //       .set('Authorization', 'Bearer invalid_token');
    //     expect(response.status).toBe(403);
    //     expect(response.body).toMatchObject({
    //       success: false,
    //       message: authExceptionMessages.TOKEN_INVALID,
    //     });
    //   });

    //   describe('User  is authenticated', () => {
    //     it('should delete a bookmark by id', async () => {
    //       const bookmarkId = 'valid_bookmark_id'; // Replace with a valid bookmark ID

    //       const response = await api
    //         .delete(`/api/bookmark/${bookmarkId}`)
    //         .set('Authorization', `Bearer ${token}`); // Use a valid token

    //       expect(response.status).toBe(204);
    //       // Add more assertions based on expected response
    //     });
    //   });
    // });
  });

  afterAll(async () => {
    await knex.migrate.rollback();
  });
});
