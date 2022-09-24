import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { getUser } from "~/features/github/api.server";
import { GithubUser } from "~/features/github/components/GithubUser";
import type { User } from "~/features/github/types";

interface LoaderData {
  user: User;
}

export const meta: MetaFunction = ({ data }) => ({
  title: `Github - ${data.user.name}`,
});

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error.message); // Vc DEVE mandar para Datadog ou similar!

  return <h1>Whoops. fui capturado em github.$user.tsx</h1>;
}

export const loader: LoaderFunction = async ({ params }) =>
  json<LoaderData>({
    user: await getUser(params.user ?? ""),
  });

export default function () {
  const { user } = useLoaderData<LoaderData>();

  return (
    <>
      <GithubUser user={user} />
      <p>
        <Link prefetch="intent" to="repos">
          Ver repos
        </Link>
      </p>
      <hr />
      <Outlet />
    </>
  );
}
