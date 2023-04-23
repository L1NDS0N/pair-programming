import { NextApiRouter } from '../core/NextApiRouter';
import { hashPasswordMiddleware } from '../middlewares/hash-password-middleware';
import prisma from '@/server/prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

export class AuthController {
	router: NextApiRouter;
	constructor(_router: NextApiRouter) {
		this.router = _router;
	}
    handler() {
		return this.router.handle();
	}

	async login() {
		this.router.post(
			async (req: NextApiRequest, res: NextApiResponse) => {
				const { email, password } = req.body;
				console.log(password);
				if (!email || !password) {
					return res
						.status(400)
						.json({ error: 'E-mail e senha são obrigatórios' });
				}

				try {
					const user = await prisma.user.findUnique({ where: { email } });

					if (!user || !(await bcrypt.compare(password, user.password))) {
						return res.status(401).json({ error: 'E-mail ou senha inválidos' });
					}

					// lembrar de modificar o sign para um valor oriundo do .env
					const token = jwt.sign({ userId: user.id }, 'dev', {
						expiresIn: '8h',
					});

					// Retornar o token e informações do usuário
					res.json({
						token,
						user: {
							id: user.id,
							name: user.name,
							email: user.email,
							admin: user.admin,
						},
					});
				} catch (error) {
					console.error('Erro ao fazer login:', error);
					res.status(500).json({ error: 'Erro ao fazer login' });
				}
			},
			[hashPasswordMiddleware]
		);
	}
	
}
