import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/server-supabase";
import { AdminLayout } from "@/components/admin/layout/AdminLayout";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return <AdminLayout>{children}</AdminLayout>;
}
