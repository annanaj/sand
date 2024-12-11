import React, { useEffect, useState } from 'react';
import { getRepositoriesForMultipleUsers } from '@/graphql/gql';
import { Repository } from '@/types/repository';

type RepositoriesProps = {
	owners: string[];
};

export default function RepositoriesList({ owners }: RepositoriesProps) {
	const [repositories, setRepositories] = useState<
		Record<string, Repository[]>
	>({});
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchRepositories = async () => {
			try {
				console.log('Fetching repositories for owners:', owners); // Log owners being fetched
				const repoData: Record<string, Repository[]> =
					await getRepositoriesForMultipleUsers(owners);

				console.log('Repo Data Response:', repoData); // Log the entire response data

				if (Object.keys(repoData).length > 0) {
					setRepositories(repoData);
				} else {
					setError('No repositories found for the specified owners.');
				}
			} catch (error) {
				console.error('Error fetching repositories:', error);
				setError(
					`Error fetching repositories: ${error instanceof Error ? error.message : 'Unknown error'}`
				);
			} finally {
				setLoading(false);
			}
		};

		void fetchRepositories();
	}, [owners]);

	if (loading) {
		return <p>Loading...</p>;
	}

	if (error) {
		return (
			<div className="error-message bg-red-100 text-red-700 border border-red-400 p-4 rounded">
				<h2 className="font-bold">An error occurred:</h2>
				<p>{error}</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
			{Object.entries(repositories).map(([owner, repos]) => {
				const ownerData = repos[0]?.owner;
				const profileUrl = `https://github.com/${ownerData.login}`; // construct profile URL

				return (
					<div key={owner} className="card-container items-start">
						<a href={profileUrl} target="_blank" rel="noreferrer">
							<div className="flex items-center gap-5 mb-4">
								<img
									src={ownerData.avatarUrl}
									alt={`${ownerData.login}'s avatar`}
									width={40}
									height={40}
									className="rounded-full items-center"
								/>
								<h2 className="title font-bold">
									{ownerData.name || ownerData.login}
								</h2>
							</div>
						</a>
						{repos.slice(0, 2).map((repo) => (
							<div key={repo.id} className="mb-4">
								<h3 className="text-base font-semibold">
									{repo.name}
								</h3>
								<p>{repo.description}</p>
								<p>
									Updated at:{' '}
									{new Date(repo.updatedAt).toLocaleString()}
								</p>
								<p>Stars: {repo.stargazerCount}</p>
								<p>
									Primary Language:{' '}
									{repo.primaryLanguage?.name || 'N/A'}
								</p>
							</div>
						))}
					</div>
				);
			})}
		</div>
	);
}
