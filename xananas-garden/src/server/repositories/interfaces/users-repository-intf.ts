export interface IUsersCreateData {
	name: string;
	username: string;
	email: string;
	admin?: boolean;
	password: string;
}
export interface IUsersUpdateData {
	name?: string;
	username?: string;
	email?: string;
	admin?: boolean;
}

export interface IUsersData {
	id: string;
	name: string;
	username: string;
	email: string;
	admin: boolean;
}

export interface IUsersRepository {
	create: (data: IUsersCreateData) => Promise<void>;
	findOne: (id: string) => Promise<IUsersData>;
	updateOne: (id: string, data: IUsersUpdateData) => Promise<void>;
	updatePassword: (id: string, password: string) => Promise<void>;
}
