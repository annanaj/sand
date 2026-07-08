import React from "react";
import { render, screen } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
} from "vitest";
import "@testing-library/jest-dom";
import "@/i18n";
import type { Repository } from "@/types/repository";
import { RepositoriesList } from "./RepositoriesList";
import { getRepositoriesForMultipleUsers } from "@/graphql/gql";

vi.mock("@/graphql/gql", () => ({
  getRepositoriesForMultipleUsers: vi.fn(),
}));

const mockedGetRepositories = vi.mocked(
  getRepositoriesForMultipleUsers,
);

const makeRepo = (
  overrides: Partial<Repository> = {},
): Repository => ({
  id: "repo-1",
  name: "sand",
  description: "just a simple scratch crud app",
  createdAt: "2024-01-01T00:00:00Z",
  updatedAt: "2024-06-01T00:00:00Z",
  stargazerCount: 42,
  forkCount: 3,
  issues: { totalCount: 1 },
  primaryLanguage: { name: "TypeScript" },
  owner: {
    login: "annanaj",
    avatarUrl: "https://example.com/avatar.png",
    name: "Anna",
  },
  ...overrides,
});

describe("RepositoriesList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state while fetching", () => {
    mockedGetRepositories.mockReturnValue(
      new Promise(() => {}),
    );
    render(<RepositoriesList owners={["annanaj"]} />);
    expect(
      screen.getByText("Loading..."),
    ).toBeInTheDocument();
  });

  it("renders repositories on success", async () => {
    mockedGetRepositories.mockResolvedValue({
      annanaj: [makeRepo()],
    });
    render(<RepositoriesList owners={["annanaj"]} />);

    expect(
      await screen.findByText("sand"),
    ).toBeInTheDocument();
    expect(screen.getByText("Anna")).toBeInTheDocument();
    expect(
      screen.getByText("Stars: 42"),
    ).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "https://github.com/annanaj",
    );
    expect(
      screen.queryByText("Loading..."),
    ).not.toBeInTheDocument();
  });

  it("falls back to login when owner name is missing", async () => {
    mockedGetRepositories.mockResolvedValue({
      annanaj: [
        makeRepo({
          owner: {
            login: "annanaj",
            avatarUrl: "https://example.com/avatar.png",
          },
        }),
      ],
    });
    render(<RepositoriesList owners={["annanaj"]} />);

    expect(
      await screen.findByRole("heading", {
        name: "annanaj",
      }),
    ).toBeInTheDocument();
  });

  it('renders "N/A" when repo has no primary language', async () => {
    mockedGetRepositories.mockResolvedValue({
      annanaj: [makeRepo({ primaryLanguage: null })],
    });
    render(<RepositoriesList owners={["annanaj"]} />);

    expect(
      await screen.findByText(/Primary Language:/),
    ).toHaveTextContent("Primary Language: N/A");
  });

  it("skips owner with empty repo list (ownerData guard) and still renders others", async () => {
    mockedGetRepositories.mockResolvedValue({
      emptyOwner: [],
      annanaj: [makeRepo()],
    });
    render(
      <RepositoriesList
        owners={["emptyOwner", "annanaj"]}
      />,
    );

    expect(
      await screen.findByText("sand"),
    ).toBeInTheDocument();
    // guard: only one owner card is rendered, emptyOwner produces null
    expect(screen.getAllByRole("link")).toHaveLength(1);
  });

  it("shows error message when no repositories are found", async () => {
    mockedGetRepositories.mockResolvedValue({});
    render(<RepositoriesList owners={["annanaj"]} />);

    expect(
      await screen.findByText(
        "No repositories found for the specified owners.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("An error occurred:"),
    ).toBeInTheDocument();
  });

  it("shows error message when the fetch rejects", async () => {
    const consoleSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    mockedGetRepositories.mockRejectedValue(
      new Error("Network down"),
    );
    render(<RepositoriesList owners={["annanaj"]} />);

    expect(
      await screen.findByText(
        "Error fetching repositories: Network down",
      ),
    ).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
