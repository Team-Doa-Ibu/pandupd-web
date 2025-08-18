import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import ScreeningResultPage from "../components/pages/ScreeningResultPage";
import { Navbar } from "../components/ui/Navbar";
import { Footer } from "../components/ui/footer";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { getSession, commitSession } from "~/utils/session.server";

export type ScreeningLoaderData = {
  id: number | null;
  focusType: string | null;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const id = formData.get("id");
  const type = formData.get("type"); // optional focus
  if (!id) return json({ error: "Missing id" }, { status: 400 });

  const session = await getSession(request.headers.get("Cookie"));
  session.set("screening:id", Number(id));
  session.set("screening:type", typeof type === "string" ? type : null);

  return redirect("/screening-result", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const id = session.get("screening:id") as number | undefined;
  const focusType = (session.get("screening:type") as string | null) ?? null;

  return json<ScreeningLoaderData>({ id: id ?? null, focusType });
}

export default function ScreeningResult() {
  const data = useLoaderData<ScreeningLoaderData>();

  return (
    <ProtectedRoute>
      <Navbar />
      <ScreeningResultPage
        loaderId={data.id ?? undefined}
        focusType={data.focusType ?? undefined}
      />
      <Footer />
    </ProtectedRoute>
  );
}
