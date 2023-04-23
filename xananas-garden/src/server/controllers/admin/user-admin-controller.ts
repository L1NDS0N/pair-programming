import { NextApiRouter } from '@/server/core/NextApiRouter';
import { authenticateAdminMiddleware } from '@/server/middlewares/authenticate-middleware';
import { hashPasswordMiddleware } from '@/server/middlewares/hash-password-middleware';
import prisma from '@/server/lib/prisma/client';
import bcrypt from 'bcrypt';
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
					const hashedPassword = await bcrypt.hash(password, 10);
					await prisma.user.create({
						data: { name, username, email, password: hashedPassword },
					});

					return res.status(201);
				} catch (error) {
					console.error('Erro ao criar usuário:', error);
					res.status(500).json({ error: 'Erro ao criar usuário' });
				}
			},
			[authenticateAdminMiddleware, hashPasswordMiddleware]
		);
	}

	async update() {
		this.router.put(
			async (req: NextApiRequest, res: NextApiResponse) => {
				const { id, name, email, password } = req.body;
				if (!id || !name || !email || !password) {
					return res
						.status(400)
						.json({ error: 'ID, nome, e-mail e senha são obrigatórios' });
				}

				try {
					const hashedPassword = await bcrypt.hash(password, 10);
					const user = await prisma.user.update({
						where: { id },
						data: { name, email, password: hashedPassword },
					});

					res.json({
						user: {
							id: user.id,
							name: user.name,
							email: user.email,
							admin: user.admin,
						},
					});
				} catch (error) {
					console.error('Erro ao atualizar usuário:', error);
					res.status(500).json({ error: 'Erro ao atualizar usuário' });
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
					await prisma.user.delete({ where: { id } });

					res.json({ message: 'Usuário deletado com sucesso' });
				} catch (error) {
					console.error('Erro ao deletar usuário:', error);
					res.status(500).json({ error: 'Erro ao deletar usuário' });
				}
			},
			[authenticateAdminMiddleware]
		);
	}
}
