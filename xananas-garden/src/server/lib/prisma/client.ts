import { PrismaClient } from '@prisma/client';

export default class Prisma {
	private static prismaClient: PrismaClient;
	private static instance: Prisma;

	constructor() {
		if (!Prisma.instance) {
			Prisma.instance = this;
			Prisma.prismaClient = new PrismaClient({ log: ['query'] });
		}

		return Prisma.instance;
	}

	public static new() {
		if (!Prisma.prismaClient) {
			Prisma.prismaClient = new PrismaClient({ log: ['query'] });
		}
		return Prisma.prismaClient;
	}

	public static async disconnect() {
		await Prisma.prismaClient.$disconnect();
	}
}
