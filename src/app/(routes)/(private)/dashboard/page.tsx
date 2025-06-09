"use client";

import { useAuth } from "@/app/(contexts)/auth-provider";

const DashboardPage = () => {
  const { user } = useAuth();
  return <div>DashboardPage {user?.email}</div>;
};

export default DashboardPage;
