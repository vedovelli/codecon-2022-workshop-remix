import type { Repo, User } from "./types";

const endpoint = "https://api.github.com";

const config = {
  headers: {
    accept: "application/vnd.github.v3+json",
    Authorization: `token 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`,
  },
};

export const getUser = async (user: string): Promise<User> => {
  const res = await fetch(`${endpoint}/users/${user}`, config);

  return res.json();
};

export const getRepos = async (user: string): Promise<Repo[]> => {
  const res = await fetch(`${endpoint}/users/${user}/repos`, config);

  return res.json();
};
