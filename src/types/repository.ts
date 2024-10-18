export type Repository = {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string;
	stargazerCount: number;
	forkCount: number;
	issues: {
		totalCount?: number;
	};
	primaryLanguage: {
		name: string;
	} | null;
	owner: {
		login: string;
		avatarUrl: string;
		name?: string;
	};
};
