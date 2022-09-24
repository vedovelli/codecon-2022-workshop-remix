import type { User } from "../types";

interface GithubUserProps {
  user: User;
}

export function GithubUser({ user }: GithubUserProps) {
  return (
    <>
      <h1>
        <a href={user.html_url}>{user.name}</a>
      </h1>
      <p>{user.bio}</p>
      <p>{user.location}</p>
      <p>{user.company}</p>
      <img src={user.avatar_url} alt={user.name} width="100" />
    </>
  );
}
