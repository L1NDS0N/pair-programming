import request from 'supertest';
import {
	createTestClient,
	getApiRoutesDirHandler,
} from '../../helpers/api-client-create-helper';

describe('Api tests suite for authentication', () => {
	let client: request.SuperTest<request.Test>;

	beforeAll(() => {
		client = createTestClient(getApiRoutesDirHandler('/admin/auth'));
	});

	it('Should not login without user credentials', async () => {
		const response = await client.post('/');

		expect(response.status).toBe(400);
		expect(response.body).not.toHaveProperty('user');
		expect(response.body).not.toHaveProperty('token');
		expect(response.body).toEqual({ error: 'E-mail e senha são obrigatórios' });
	});

	it('Should not login without password', async () => {
		const response = await client.post('/').send({ email: 'testador' });

		expect(response.status).toBe(400);
		expect(response.body).not.toHaveProperty('user');
		expect(response.body).not.toHaveProperty('token');
		expect(response.body).toEqual({ error: 'E-mail e senha são obrigatórios' });
	});

	it('Should not login without email', async () => {
		const response = await client.post('/').send({ password: 'password' });

		expect(response.status).toBe(400);
		expect(response.body).not.toHaveProperty('user');
		expect(response.body).not.toHaveProperty('token');
		expect(response.body).toEqual({ error: 'E-mail e senha são obrigatórios' });
	});

	it('Should not login properly', async () => {
		const response = await client
			.post('/')
			.send({ email: 'wrong_email@gmail.com', password: 'wrong_pass' });

		expect(response.status).toBe(401);
		expect(response.body).not.toHaveProperty('user');
		expect(response.body).not.toHaveProperty('token');
		expect(response.body).toEqual({ error: 'E-mail ou senha inválidos' });
	});

	it('Should login succefully using its email', async () => {
		const response = await client
			.post('/')
			.send({ email: 'lindson@gmail.com', password: 'password' });

		expect(response.status).toBe(200);
		expect(response.body.user.userSecret).not.toBeDefined();
		expect(response.body.user.password).not.toBeDefined();
		expect(response.body).toEqual(
			expect.objectContaining({
				token: expect.anything(),
				user: expect.objectContaining({
					id: expect.anything(),
					name: expect.anything(),
					username: expect.anything(),
					email: expect.anything(),
					admin: expect.anything(),
				}),
			})
		);
	});

	it('Should login succefully using its username as email', async () => {
		const response = await client
			.post('/')
			.send({ email: 'testador', password: 'password' });

		expect(response.status).toBe(200);
		expect(response.body.user.userSecret).not.toBeDefined();
		expect(response.body.user.password).not.toBeDefined();
		expect(response.body).toEqual(
			expect.objectContaining({
				token: expect.anything(),
				user: expect.objectContaining({
					id: expect.anything(),
					name: expect.anything(),
					username: expect.anything(),
					email: expect.anything(),
					admin: expect.anything(),
				}),
			})
		);
	});

	it('Should login succefully using its email in case insensitive format', async () => {
		const response = await client
			.post('/')
			.send({ email: 'LiNdSoN@gMaIl.CoM', password: 'password' });

		expect(response.status).toBe(200);
		expect(response.body.user.userSecret).not.toBeDefined();
		expect(response.body.user.password).not.toBeDefined();
		expect(response.body).toEqual(
			expect.objectContaining({
				token: expect.anything(),
				user: expect.objectContaining({
					id: expect.anything(),
					name: expect.anything(),
					username: expect.anything(),
					email: expect.anything(),
					admin: expect.anything(),
				}),
			})
		);
	});
});
