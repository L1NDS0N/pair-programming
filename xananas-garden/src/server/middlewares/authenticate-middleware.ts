import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaUsersRepository } from '../repositories/implementation/prisma/users-repository-impl';

export interface TJwtPayload extends jwt.JwtPayload {
	id: string;
	userSecret: string;
}
export const authenticateAdminMiddleware = async (
	req: NextApiRequest,
	res: NextApiResponse,
	next: () => void
) => {
	try {
		let firstUserLogin = false;
		if (req.query) {
			const { first_user } = req.query;
			firstUserLogin = Boolean(first_user);
		}

		if (firstUserLogin) {
			const usersRepository = new PrismaUsersRepository();
			const alreadyHasUsers = await usersRepository.hasUsers();
			if (alreadyHasUsers) {
				throw new Error('Esta funcionalidade já está obsoleta');
			}
			return next();
		}

		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			return res
				.status(401)
				.json({ error: 'Token de autorização não fornecido' });
		}

		const token = authorizationHeader.replace('Bearer ', '');
		const { id: userId, userSecret } = <TJwtPayload>jwt.verify(token, 'dev');

		if (userSecret) {
			const usersRepository = new PrismaUsersRepository();
			const user = await usersRepository.findOne(userId);

			if (!user || user.admin === false || user.userSecret !== userSecret) {
				throw new Error('O seu usuário não é valido, efetue login novamente');
			}
		}
		next();
	} catch (error: any) {
		return res.status(400).json({ error: error.message });
	}
};
