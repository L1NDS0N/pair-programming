import { Server } from 'http';
import request from 'supertest';
import {
	createClientServer,
	getApiRoutesDirHandler,
} from '../../helpers/api-client-create-helper';

type TUserCredentials = {
	token: string;
	user: {
		id: string;
		name: string;
		username: string;
		email: string;
		admin: boolean;
	};
};
type TUserLogin = {
	email: string;
	password: string;
};
describe('Api tests suite for user crud', () => {
	let userCredentials: TUserCredentials;
	let userLogin: TUserLogin;
	let client: request.SuperTest<request.Test>;
	let server: Server;

	beforeAll(() => {
		const { _client, _server } = createClientServer(
			getApiRoutesDirHandler('/admin/user')
		);
		server = _server;
		client = _client;
	});

	afterAll(done => {
		if (server) {
			server.close(() => {
				done();
			});
		}
		done();
	});

	it('Should create user without a token on first user table record', async () => {
		const userToBeCreated = {
			first_user: true,
			name: 'Lindson França',
			username: 'testador',
			email: 'lindson@gmail.com',
			password: 'password',
		};
		userLogin = {
			email: userToBeCreated.email,
			password: userToBeCreated.password,
		};

		const response = await client.post('/').send(userToBeCreated);

		if (response.status === 400) {
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				error: 'Esta funcionalidade já está obsoleta',
			});
		} else {
			expect(response.status).toBe(201);
		}
	});

	it('Should login admin credentials', async () => {
		const { _client, _server } = createClientServer(
			getApiRoutesDirHandler('/admin/auth')
		);
		async function login(aUserLogin: TUserLogin) {
			const response = await _client.post('/').send(aUserLogin);

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
			userCredentials = response.body as TUserCredentials;
		}
		await login(userLogin);
		server.close(() => {
			client.checkout('/admin/auth');
		});
	});

	it('Should create an user only using an admin credential', async () => {
		const response = await client
			.post('/')
			.send({
				name: 'Tester user',
				username: 'tester',
				email: 'testing@gmail.com',
				password: 'test_pass',
			})
			.set('Authorization', `Bearer ${userCredentials.token}`);
		if (response.status === 400) {
			expect(response.status).toBe(400);
			expect(response.body).toEqual({
				error: 'Erro ao criar usuário. Usuário já existe',
			});
		} else {
			expect(response.status).toBe(201);
		}
	});
// consertar esse teste
	it('Should update a user only with an admin token', async () => {
		const response = await client
			.put('/')
			.send({
				id: userCredentials.user.id,
				name: 'Tester user updated',
			})
			.set('Authorization', `Bearer ${userCredentials.token}`);
		

		// if (response.status === 400) {
			expect(response.status).toBe(200);
		// 	expect(response.body).toEqual({error: 'Erro ao criar usuário. Usuário já existe'})
		// } else {
		// 	expect(response.status).toBe(201);
		// }
	});
});
