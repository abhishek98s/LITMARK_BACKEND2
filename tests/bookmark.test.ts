import supertest from 'supertest';
import app from '../src/app';

const api = supertest(app);

describe('/s', () => {
  it('should return hello', async () => {
    const response = await api.get('/s');
    expect(response.text).toBe('Hello world');
  });
});
