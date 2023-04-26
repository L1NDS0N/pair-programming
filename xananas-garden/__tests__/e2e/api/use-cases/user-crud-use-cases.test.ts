import { Server } from 'http';
import request from 'supertest';
import {
	createClientServer,
	getApiRoutesDirHandler,
} from '../../helpers/api-client-create-helper';

describe('Api tests suite for user crud', () => {
	let client: request.SuperTest<request.Test>;
	let server: Server;

	beforeAll(() => {
		const { _client, _server } = createClientServer(
			getApiRoutesDirHandler('/admin/signin')
		);
		server = _server;
		client = _client;
	});

	afterAll(done => {
		server.close(() => {
			done();			
		});
	});

	it('Should create user without a token on first user table record', async () => {
		const response = await client.post('/').query('first_user=true').send({
			name: 'Lindson França',
			username: 'testador',
			email: 'lindson@gmail.com',
			password: 'password',
		});
		// expect(response.status).toBe(400);
		// expect(response.body).toEqual({ error: 'Token de autorização inválido' });
	});
});
