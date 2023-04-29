import { DADOS } from '@/faker/catalogo-fake';
import { NextApiRouter } from '@/server/core/NextApiRouter';
import { sanitizeObject } from '@/server/helpers/sanitizeObject';
import { whoAmI } from '@/server/helpers/whoami';
import Prisma from '@/server/lib/prisma/client';
import { authenticateAdminMiddleware } from '@/server/middlewares/authenticate-middleware';
import { hashPasswordMiddleware } from '@/server/middlewares/hash-password-middleware';
import { TUserCredentialsJwtSignature } from '@/server/models/User';
import { PrismaUsersRepository } from '@/server/repositories/implementation/prisma/users-repository-impl';
import { NextApiRequest, NextApiResponse } from 'next';

export class UserAdminController {
	router: NextApiRouter;
	constructor(_router: NextApiRouter) {
		this.router = _router;
	}
	handler() {
		return this.router.handle();
	}

	async create() {
		this.router.post(
			async (req: NextApiRequest, res: NextApiResponse) => {
				const { name, username, email, password } = req.body;
				if (!name || !username || !email || !password) {
					return res
						.status(400)
						.json({ error: 'Nome, apelido, e-mail e senha são obrigatórios' });
				}

				try {
					let admin = false;
					if (req.body && req.body.first_user) {
						admin = true;
					}
					const usersRepository = new PrismaUsersRepository();
					const userAlreadyExists = await usersRepository.findByEmail(email);
					if (userAlreadyExists) throw new Error('Usuário já existe');

					usersRepository.create({ name, email, username, password, admin });
					return res.status(201).end();
				} catch (error: any) {
					return res.status(400).json({
						error: 'Erro ao criar usuário. ' + error.message,
					});
				}
			},
			[authenticateAdminMiddleware, hashPasswordMiddleware]
		);
	}

	async update() {
		this.router.put(
			async (req: NextApiRequest, res: NextApiResponse) => {
				const { id, name, email, username } = req.body;

				try {
					const jwtSecret = process.env.JWT_SECRET as string;
					const userCredentials = whoAmI<TUserCredentialsJwtSignature>(
						req.headers.authorization!,
						jwtSecret
					);

					if (id && !userCredentials.admin && id !== userCredentials.id) {
						throw new Error(
							'Você não pode alterar informações de outro usuário sem ser um administrador do sistema'
						);
					}
					const usersRepository = new PrismaUsersRepository();
					const idForUpdate = id ?? userCredentials.id;

					if (email) {
						const user = await usersRepository.findByEmail(email);
						if (user && user.id !== idForUpdate) {
							throw new Error('Email já está sendo utilizado');
						}
					}
					if (username) {
						const user = await usersRepository.findByUsername(username);
						if (user && user.id !== idForUpdate) {
							throw new Error('Username já está sendo utilizado');
						}
					}

					const objSanitized = sanitizeObject({ name, email, username });
					const user = await usersRepository.updateOne(
						idForUpdate,
						objSanitized
					);

					return res.status(200).json({
						user: {
							id: user.id,
							name: user.name,
							username: user.username,
							email: user.email,
							admin: user.admin,
						},
					});
				} catch (error: any) {
					return res
						.status(500)
						.json({ error: 'Erro ao atualizar usuário. ' + error.message });
				}
			},
			[authenticateAdminMiddleware, hashPasswordMiddleware]
		);
	}

	async delete() {
		this.router.delete(
			async (req: NextApiRequest, res: NextApiResponse) => {
				const { id } = req.body;
				if (!id) {
					return res.status(400).json({ error: 'ID do usuário é obrigatório' });
				}

				try {
					await Prisma.new().user.delete({ where: { id } });

					return res.json({ message: 'Usuário deletado com sucesso' });
				} catch (error) {
					console.error('Erro ao deletar usuário:', error);
					return res.status(500).json({ error: 'Erro ao deletar usuário' });
				}
			},
			[authenticateAdminMiddleware]
		);
	}
}
