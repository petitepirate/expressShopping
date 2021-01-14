process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('./app');
let items = require('./fakeDb');

beforeEach(() => {
  items.push({
    name: 'popsicle',
    price: 1.45,
  });
});

afterEach(() => {
  items.length = 0;
});

describe('GET /items', () => {
  test('Gets a list of items', async () => {
    const resp = await request(app).get('/items');

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ items: items });
  });
});

describe('POST /items', () => {
  test('Posts a new item', async () => {
    const newItem = { name: 'Onion', price: 1.05 };
    const resp = await request(app).post('/items').send(newItem);

    expect(resp.statusCode).toBe(201);
    expect(resp.body).toEqual({ added: newItem });
  });

  test('Returns 400 and error if no item name', async () => {
    const noName = { price: 1.05 };
    const resp = await request(app).post('/items').send(noName);

    expect(resp.statusCode).toBe(400);
    expect(resp.body).toEqual({ error: 'Item name and price required' });
  });

  test('Returns 400 and error if no item price', async () => {
    const noPrice = { name: 'Onion' };
    const resp = await request(app).post('/items').send(noPrice);

    expect(resp.statusCode).toBe(400);
    expect(resp.body).toEqual({ error: 'Item name and price required' });
  });
});

describe('GET /items/:name', () => {
  test('Get single item info', async () => {
    const resp = await request(app).get('/items/popsicle');

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ name: 'popsicle', price: 1.45 });
  });

  test('Returns 404 if item not found', async () => {
    const resp = await request(app).get('/items/onion');

    expect(resp.statusCode).toBe(404);
    expect(resp.body).toEqual({ error: 'Item not found' });
  });
});

describe('PATCH /items/:name', () => {
  test('Updates an item', async () => {
    const updatedItem = { name: 'popsicle', price: 3.5 };
    const resp = await request(app).patch('/items/popsicle').send(updatedItem);

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ updated: updatedItem });
  });

  test('Returns 404 if item not found', async () => {
    const updatedItem = { name: 'popsicle', price: 3.5 };
    const resp = await request(app).patch('/items/nothing').send(updatedItem);

    expect(resp.statusCode).toBe(404);
    expect(resp.body).toEqual({ error: 'Item not found' });
  });
});

describe('DELETE /items/:name', () => {
  test('Deletes an item', async () => {
    const resp = await request(app).delete('/items/popsicle');

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toEqual({ message: 'deleted' });
  });

  test('Returns 404 if item not found', async () => {
    const resp = await request(app).delete('/items/nothing');

    expect(resp.statusCode).toBe(404);
    expect(resp.body).toEqual({ error: 'Item not found' });
  });
});
