import { DADOS } from '@/faker/catalogo-fake';
import { NextApiRouter } from '@/server/core/NextApiRouter';
import { hashPassword } from '@/server/helpers/hashPassword';
import { sanitizeObject } from '@/server/helpers/sanitizeObject';
import { whoAmI } from '@/server/helpers/whoami';
import Prisma from '@/server/lib/prisma/client';
import { authenticateAdminMiddleware } from '@/server/middlewares/authenticate-middleware';
import { hashPasswordMiddleware } from '@/server/middlewares/hash-password-middleware';
import { TUserCredentialsJwtSignature } from '@/server/models/User';
import { GLOBAL_CONST } from '@/server/references/global-constants';
import { PrismaUsersRepository } from '@/server/repositories/implementation/prisma/users-repository-impl';
import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

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
				const { name, username, email, password, hashedPassword } = req.body;
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
					const emailAlreadyExists = await usersRepository.findByEmail(email);
					if (emailAlreadyExists) throw new Error('Usuário já existe');
					const usernameAlreadyExists = await usersRepository.findByUsername(
						username
					);
					if (usernameAlreadyExists) throw new Error('Usuário já existe');

					usersRepository.create({
						name,
						email,
						username,
						password: hashedPassword,
						admin,
					});
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
				const { maxPasswordLength, minPasswordLength } = GLOBAL_CONST.user;
				const schema = z.object({
					id: z.string().optional(),
					name: z.string().optional(),
					email: z.string().email('Formato de email inválido.').optional(),
					username: z
						.string()
						.regex(
							/^[a-zA-Z0-9._-]{3,20}$/,
							'O formato do apelido de usuário é inválido.'
						)
						.optional(),
					password: z
						.string()
						.min(
							minPasswordLength,
							`Tamanho mínimo do campo de senha é ${minPasswordLength.toString()} caracteres`
						)
						.max(
							maxPasswordLength,
							`Tamanho máximo da senha ${maxPasswordLength.toString()} caracteres`
						)
						.refine(password => /[a-z]/.test(password), {
							message: 'A Senha deve conter pelo menos uma letra minúscula',
						})
						.refine(password => /[A-Z]/.test(password), {
							message: 'A Senha deve conter pelo menos uma letra maiúscula',
						})
						.optional(),
				});
				try {
					const { id, name, email, username, password } = schema.parse(
						req.body
					);
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
						if (user) {
							throw new Error('Email já está sendo utilizado');
						}
					}
					if (username) {
						const user = await usersRepository.findByUsername(username);
						if (user) {
							throw new Error('Username já está sendo utilizado');
						}
					}

					const objSanitized = sanitizeObject({
						name,
						email,
						username,
						password,
					});
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
					if (error instanceof z.ZodError) {
						return res.status(400).json({
							error: 'Erro ao atualizar usuário. ' + error.issues[0].message,
						});
					}
					return res
						.status(400)
						.json({ error: 'Erro ao atualizar usuário. ' + error.message });
				}
			},
			[authenticateAdminMiddleware]
		);
	}

	async delete() {
		this.router.delete(
			async (req: NextApiRequest, res: NextApiResponse) => {
				const { id } = req.body;

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
				const idForDelete = id ?? userCredentials.id;

				try {
					if (await usersRepository.deleteOne(idForDelete)) {
						return res.json({ message: 'Usuário deletado com sucesso' });
					} else {
						throw new Error('Erro durante deleção do usuário');
					}
				} catch (error: any) {
					return res
						.status(400)
						.json({ error: 'Erro ao deletar usuário ' + error.message });
				}
			},
			[authenticateAdminMiddleware]
		);
	}
}
