import DashboardLayoutWrapper from "@/components/dashboard/DashboardLayoutWrapper";
import AuthGuard from "./AuthGuard";

export const metadata = {
  title: "Shop Owner Dashboard — CakeStore",
  description: "Manage your bakery orders, cakes, and customer enquiries.",
};

export default function OwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayoutWrapper>{children}</DashboardLayoutWrapper>
    </AuthGuard>
  );
}

