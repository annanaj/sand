import { gql, GraphQLClient } from 'graphql-request';
import { Repository } from '@/types/repository';

const GITHUB_TOKEN = process.env.VITE_PUBLIC_GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
	throw new Error('GitHub token not found in environment variables');
}

const client = new GraphQLClient('https://api.github.com/graphql', {
	headers: {
		Authorization: `Bearer ${GITHUB_TOKEN}`,
	},
});

const createQuery = (owners: string[], first: number) => {
	const ownerQueries = owners.map(
		(owner, index) => `
      user${index}: repositoryOwner(login: "${owner}") {
        repositories(first: ${first}, privacy: PUBLIC) {
          nodes {
            id
            name
            description
            createdAt
            updatedAt
            stargazerCount
            forkCount
            issues {
              totalCount
            }
            primaryLanguage {
              name
            }
            owner {
              login
              avatarUrl
            }
          }
        }
      }
    `
	);

	return gql`
    query GetRepositories {
      ${ownerQueries.join('\n')}
    }
  `;
};

interface RepositoriesResponse {
	[key: string]: {
		repositories: {
			nodes: Repository[];
		};
	};
}

export const getRepositoriesForMultipleUsers = async (
	owners: string[],
	first: number = 10
): Promise<Record<string, Repository[]>> => {
	try {
		// Log the query to check if it's correctly formed
		console.log('Executing query for owners:', owners);
		const query = createQuery(owners, first);
		console.log('Generated query:', query);

		// Perform the request
		const data: RepositoriesResponse =
			await client.request<RepositoriesResponse>(query);

		// Log the raw data response for debugging
		console.log('Received data:', data);

		// Check if the response structure is as expected
		return owners.reduce(
			(acc, owner, index) => {
				const userKey = `user${index}`;

				// Log if the expected user key doesn't exist in the response
				if (!data[userKey]) {
					console.error(
						`No data found for user: ${owner} (key: ${userKey})`
					);
					return acc;
				}

				// Log if repositories or nodes are missing
				if (
					!data[userKey].repositories ||
					!data[userKey].repositories.nodes
				) {
					console.error(
						`Repositories not found for user: ${owner} (key: ${userKey})`
					);
					return acc;
				}

				acc[owner] = data[userKey].repositories.nodes;
				return acc;
			},
			{} as Record<string, Repository[]>
		);
	} catch (error: unknown) {
		// Log the complete error object for more details
		console.error('Error fetching repositories:', error);

		// Log specific GraphQL error messages if available
		if (error.response && error.response.errors) {
			console.error('GraphQL errors:', error.response.errors);
		}

		return {};
	}
};
