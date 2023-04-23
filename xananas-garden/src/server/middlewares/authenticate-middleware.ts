import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { PrismaUsersRepository } from '../repositories/implementation/prisma/users-repository-impl';

export interface TJwtPayload extends jwt.JwtPayload {
	id: string;
	admin: boolean;
}
export const authenticateAdminMiddleware = async (
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
		const decodedJwt = <TJwtPayload>jwt.verify(token, 'dev');
		if (decodedJwt.id) {
			const usersRepository = new PrismaUsersRepository();
			const user = await usersRepository.findOne(decodedJwt.id);

			if (!user || (user && user.admin !== decodedJwt.admin)) {
				throw new Error('O seu usuário não é valido, efetue login novamente');
			}
		}
		next();
	} catch (error) {
		return res.status(401).json({ error: 'Token de autorização inválido' });
	}
};
