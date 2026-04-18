"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/useAuth";
import useDashboardData from "@/hooks/useDashboardData";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import MyTasks from "@/components/dashboard/MyTasks";
import UpcomingDeadlines from "@/components/dashboard/UpcomingDeadlines";
import RecentActivity from "@/components/dashboard/RecentActivity";
import WorkspacesOverview from "@/components/dashboard/WorkspacesOverview";
import DashboardSkeleton from "@/components/dashboard/DashboardSkeleton";

export default function Home() {
  const { user, userDoc, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user?.uid) router.push("/login");
  }, [authLoading, user?.uid, router]);

  const {
    workspaces,
    myTasks,
    counts,
    upcomingDeadlines,
    recentActivity,
    loading,
  } = useDashboardData(user?.uid);

  if (authLoading || loading || !user) {
    return <DashboardSkeleton />;
  }

  return (
    <main className="container mx-auto px-6 py-10 max-w-7xl">
      <DashboardHeader userDoc={userDoc} user={user} />

      <DashboardStats counts={counts} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <MyTasks tasks={myTasks} />
          <RecentActivity tasks={recentActivity} />
        </div>

        <div className="flex flex-col gap-4">
          <UpcomingDeadlines tasks={upcomingDeadlines} />
          <WorkspacesOverview workspaces={workspaces} />
        </div>
      </div>
    </main>
  );
}
