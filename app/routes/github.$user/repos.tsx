import { json, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Repo } from "~/features/github/types";
import { getRepos } from "../../features/github/api.server";
import { useLoaderData } from "@remix-run/react";
import pick from "lodash/pick";

interface LoaderData {
  repos: Repo[];
}

export const meta: MetaFunction = ({ parentsData }) => {
  return {
    title: `Github - ${parentsData["routes/github.$user"].user.name} - REPOS`,
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const repos = await getRepos(params.user ?? "");

  return json<LoaderData>({
    repos: repos.map((repo: Repo) =>
      pick(repo, ["id", "node_id", "name", "full_name"])
    ),
  });
};

export default function () {
  const { repos } = useLoaderData<LoaderData>();
  return (
    <>
      <h1>Repos</h1>
      <ul>
        {repos.map((repo: Repo) => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error.message); // Vc DEVE mandar para Datadog ou similar!

  return <h1>Whoops. Quebrei na rota repos.tsx</h1>;
}
