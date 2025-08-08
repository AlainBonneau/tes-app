// app/reset-password/page.tsx
import ResetPasswordClient from "./ResetPasswordClient";

type SearchParams = { token?: string; email?: string };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const token = sp?.token ?? "";
  const email = sp?.email ?? "";

  return <ResetPasswordClient token={token} email={email} />;
}
