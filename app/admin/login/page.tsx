import AdminLoginForm from "./login-form";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string | string[];
  }>;
};

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const resolvedSearchParams = await searchParams;
  const initialError = Array.isArray(resolvedSearchParams.error)
    ? resolvedSearchParams.error[0] ?? ""
    : resolvedSearchParams.error ?? "";

  return <AdminLoginForm initialError={initialError} />;
}
