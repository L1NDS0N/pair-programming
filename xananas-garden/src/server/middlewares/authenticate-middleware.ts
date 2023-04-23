import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
export const authMiddleware = (
	req: NextApiRequest,
	res: NextApiResponse,
	next: () => void
) => {
	try {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			return res
				.status(401)
				.json({ error: 'Token de autorização não fornecido' });
		}

		const token = authorizationHeader.replace('Bearer ', '');

		const decoded = jwt.verify(token, 'dev');
		console.log(decoded);

		next();
	} catch (error) {
		return res.status(401).json({ error: 'Token de autorização inválido' });
	}
};

