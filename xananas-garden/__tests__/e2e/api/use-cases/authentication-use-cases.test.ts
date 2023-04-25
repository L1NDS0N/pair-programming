import { createServer, RequestListener } from 'http';
import { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node';
import path from 'path';
import request from 'supertest';

function createTestClient(handler: NextApiHandler) {
	const listener: RequestListener = (req, res) => {
		return apiResolver(
			req,
			res,
			undefined,
			handler,
			{
				previewModeEncryptionKey: '',
				previewModeId: '',
				previewModeSigningKey: '',
			},
			false
		);
	};

	return request(createServer(listener));
}
function getApiRoutesDirHandler(relativeDir: string) {
	const apiRoutesDir = path.join(
		process.cwd(),
		`src/pages/api/v1${relativeDir}`
	);
	return require(`${apiRoutesDir}`).default;
}

describe('Api tests suite for authentication', () => {
	it('Should not login without user credentials', async () => {
		const client = createTestClient(getApiRoutesDirHandler('/admin/auth'));
		const response = await client.post('/');

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'E-mail e senha são obrigatórios' });
	});
	it('Should not login without password', async () => {
		const client = createTestClient(getApiRoutesDirHandler('/admin/auth'));
		const response = await client.post('/').send({ email: 'testador' });

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'E-mail e senha são obrigatórios' });
	});

	it('Should not login without email', async () => {
		const client = createTestClient(getApiRoutesDirHandler('/admin/auth'));
		const response = await client.post('/').send({ password: 'password' });

		expect(response.status).toBe(400);
		expect(response.body).toEqual({ error: 'E-mail e senha são obrigatórios' });
	});
	it('Should login succefully', async () => {
		const client = createTestClient(getApiRoutesDirHandler('/admin/auth'));
		const response = await client
			.post('/')
			.send({ email: 'lindson@gmail.com', password: 'password' });
		expect(response.status).toBe(200);
		expect(response.body).toEqual(
			expect.objectContaining({
				token: expect.anything(),
				user: expect.objectContaining({
					id: expect.anything(),
					name: expect.anything(),
				}),
			})
		);
	});
});
