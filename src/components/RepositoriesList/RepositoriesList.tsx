import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getRepositoriesForMultipleUsers } from "@/graphql/gql";
import type { Repository } from "@/types/repository";

type RepositoriesProps = {
  owners: string[];
};

export function RepositoriesList({
  owners,
}: RepositoriesProps) {
  const { t } = useTranslation();
  const [repositories, setRepositories] = useState<
    Record<string, Repository[]>
  >({});
  const [error, setError] = useState<{
    key: string;
    message?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const repoData: Record<string, Repository[]> =
          await getRepositoriesForMultipleUsers(owners);

        if (Object.keys(repoData).length > 0) {
          setRepositories(repoData);
        } else {
          setError({
            key: "RepositoriesList.noRepositories",
          });
        }
      } catch (err) {
        console.error("Error fetching repositories:", err);
        setError({
          key: "RepositoriesList.fetchError",
          message:
            err instanceof Error ? err.message : undefined,
        });
      } finally {
        setLoading(false);
      }
    };

    void fetchRepositories();
  }, [owners]);

  if (loading) {
    return <p>{t("RepositoriesList.loading")}</p>;
  }

  if (error) {
    return (
      <div className="error-message bg-red-100 text-red-700 border border-red-400 p-4 rounded">
        <h2 className="font-bold">
          {t("RepositoriesList.errorTitle")}
        </h2>
        <p>
          {t(error.key, {
            message:
              error.message ??
              t("RepositoriesList.unknownError"),
          })}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {Object.entries(repositories).map(
        ([owner, repos]) => {
          const ownerData = repos[0]?.owner;
          if (!ownerData) {
            return null;
          }
          const profileUrl = `https://github.com/${ownerData.login}`; // construct profile URL

          return (
            <div
              key={owner}
              className="card-container items-start"
            >
              <a
                href={profileUrl}
                target="_blank"
                rel="noreferrer"
              >
                <div className="flex items-center gap-5 mb-4">
                  <img
                    src={ownerData.avatarUrl}
                    alt={t("RepositoriesList.avatarAlt", {
                      login: ownerData.login,
                    })}
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
                    {t("RepositoriesList.updatedAt")}{" "}
                    {new Date(
                      repo.updatedAt,
                    ).toLocaleString()}
                  </p>
                  <p>
                    {t("RepositoriesList.stars")}{" "}
                    {repo.stargazerCount}
                  </p>
                  <p>
                    {t("RepositoriesList.primaryLanguage")}{" "}
                    {repo.primaryLanguage?.name ||
                      t("RepositoriesList.notAvailable")}
                  </p>
                </div>
              ))}
            </div>
          );
        },
      )}
    </div>
  );
}
