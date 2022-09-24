import { Message } from "@prisma/client";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useTransition,
  useActionData,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { getMessages } from "~/features/chat/api.server";
import { sendMessage } from "../features/chat/api.server";

import { z } from "zod";

const schema = z.object({
  message: z.string().min(6),
});

interface LoaderData {
  messages: Message[];
}

interface ActionData {
  message?: Message | null;
  error?: string;
}

export const loader: LoaderFunction = async () => {
  return json<LoaderData>({
    messages: await getMessages(),
  });
};

export const action: ActionFunction = async ({ request }) => {
  const data = Object.fromEntries(await request.formData());
  const payload = schema.safeParse(data);

  return json<ActionData>({
    message: payload.success
      ? await sendMessage(String(data.message ?? ""))
      : null,
    error: !payload.success ? "Favor criar mensagem" : "",
  });
};

export default function () {
  const { messages } = useLoaderData<LoaderData>();
  const transtion = useTransition();
  const isSubmitting = transtion.state === "submitting";
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData<ActionData>();

  useEffect(() => {
    if (!isSubmitting) {
      formRef.current?.reset();
    }
  }, [isSubmitting]);

  return (
    <>
      <pre>{JSON.stringify(actionData, null, 2)}</pre>
      <h1>Chat!</h1>
      <ul>
        {messages.map((message: Message) => (
          <li key={message.id}>{message.message}</li>
        ))}
      </ul>
      <Form ref={formRef} method="post" style={{ display: "flex" }}>
        <textarea disabled={isSubmitting} autoFocus name="message"></textarea>
        <button type="submit" disabled={isSubmitting}>
          Enviar
        </button>
        {actionData?.error ? <p>{actionData?.error}</p> : ""}
      </Form>
      {isSubmitting ? <p>Enviando mensagem...</p> : null}
    </>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.log(error.message); // Vc DEVE mandar para Datadog ou similar!

  return <h1>{error.message}</h1>;
}
