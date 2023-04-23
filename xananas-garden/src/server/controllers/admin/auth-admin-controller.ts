import { TJwtPayload } from './../../middlewares/authenticate-middleware';
import prisma from '@/server/lib/prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { NextApiRouter } from '../../core/NextApiRouter';

export class AuthAdminController {
	router: NextApiRouter;
	constructor(_router: NextApiRouter) {
		this.router = _router;
	}
	handler() {
		return this.router.handle();
	}

	async login() {
		this.router.post(async (req: NextApiRequest, res: NextApiResponse) => {
			const { email, password } = req.body;
			if (!email || !password) {
				return res
					.status(400)
					.json({ error: 'E-mail e senha são obrigatórios' });
			}

			try {
				const user = await prisma.user.findUnique({ where: { email } });
				console.log(await bcrypt.compare(password, user!.password));

				if (!user || !(await bcrypt.compare(password, user.password))) {
					return res.status(401).json({ error: 'E-mail ou senha inválidos' });
				}

				// lembrar de modificar o sign para um valor oriundo do .env
				const token = jwt.sign(
					{ id: user.id, admin: user.admin } as TJwtPayload,
					'dev',
					{
						expiresIn: '8h',
					}
				);

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
		});
	}
}
