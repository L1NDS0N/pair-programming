import {
	IUsersCreateData,
	IUsersRepository,
} from '../../interfaces/users-repository-intf';
import {
	IUsersUpdateData,
	IUsersData,
} from '../../interfaces/users-repository-intf';
import prisma from '@/server/lib/prisma/client';

export class PrismaUsersRepository implements IUsersRepository {
	async create({ name, email, password, username }: IUsersCreateData) {
		await prisma.user.create({
			data: {
				name,
				email,
				password,
				username,
			},
		});
	}

	async findOne(id: string) {
		const user = (await prisma.user.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				name: true,
				email: true,
				username: true,
				admin: true,
			},
		})) as IUsersData;

		return user;
	}

	async updateOne(id: string, data: IUsersUpdateData) {
		await prisma.user.update({
			where: {
				id,
			},
			data,
		});
	}

	async updatePassword(id: string, password: string) {
		await prisma.user.update({
			where: {
				id,
			},
			data: {
				password,
			},
		});
	}
}
