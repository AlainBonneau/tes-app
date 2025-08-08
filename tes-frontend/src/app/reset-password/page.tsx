type PageProps = {
  searchParams: { token?: string; email?: string };
};

import ResetPasswordClient from "./ResetPasswordClient";

export default function Page({ searchParams }: PageProps) {
  const token = searchParams.token ?? "";
  const email = searchParams.email ?? "";

  return <ResetPasswordClient token={token} email={email} />;
}
