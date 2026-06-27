import { redirect } from "next/navigation";

/** The index has no section of its own — send it to the overview landing. */
export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/overview`);
}
