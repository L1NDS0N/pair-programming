import { createServer, RequestListener } from 'http';
import { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/server/api-utils/node';
import path from 'path';
import request from 'supertest';

export function createTestClient(handler: NextApiHandler) {
	const listener: RequestListener = async (req, res) => {
		return await apiResolver(
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
export function getApiRoutesDirHandler(relativeDir: string): NextApiHandler {
	const apiRoutesDir = path.join(
		process.cwd(),
		`src/pages/api/v1${relativeDir}`
	);
	return require(apiRoutesDir).default as NextApiHandler;
}
