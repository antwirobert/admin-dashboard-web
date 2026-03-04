import { useApiUrl, useCustom } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  AlertCircle,
  Clock,
  DollarSign,
  Edit,
  LogIn,
  LogOut,
  PackageCheck,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type ActivityLogs = {
  createdAt: Date;
  updatedAt: Date;
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
};

const actionConfig: Record<
  string,
  { icon: React.ComponentType<any>; color: string; label: string }
> = {
  user_created: { icon: UserPlus, color: "text-green-600", label: "New user" },
  order_created: {
    icon: ShoppingCart,
    color: "text-blue-600",
    label: "New order",
  },
  order_status_updated: {
    icon: Edit,
    color: "text-amber-600",
    label: "Order updated",
  },
  order_completed: {
    icon: PackageCheck,
    color: "text-emerald-600",
    label: "Order completed",
  },
  order_cancelled: {
    icon: AlertCircle,
    color: "text-red-600",
    label: "Order cancelled",
  },
  login: { icon: LogIn, color: "text-indigo-600", label: "Login" },
  logout: { icon: LogOut, color: "text-gray-600", label: "Logout" },
  default: { icon: Activity, color: "text-gray-500", label: "Activity" },
};

const Dashboard = () => {
  const apiUrl = useApiUrl();

  const { query } = useCustom<{
    totalOrders: number;
    revenue: number;
    pendingOrders: number;
  }>({
    url: `${apiUrl}/dashboard/metrics`,
    method: "get",
  });

  const { query: activityQuery } = useCustom<{
    data: ActivityLogs[];
    pagination: {
      limit: number;
      recentActivitiesCount: number;
      totalActivities: number;
    };
  }>({
    url: `${apiUrl}/dashboard/activity`,
    method: "get",
  });

  const recentActivities = activityQuery.data?.data;
  const isLoading = activityQuery.isLoading;
  const isError = activityQuery.isError;

  const getActionInfo = (action: string) => {
    const key = action.toLowerCase();
    return actionConfig[key] || actionConfig.default;
  };

  const metrics = query.data?.data ?? {
    totalOrders: 0,
    revenue: 0,
    pendingOrders: 0,
  };
  const metricsLoading = query.isLoading;
  const metricsError = query.error;

  const kpis = [
    {
      label: "Total Orders",
      value: metrics?.totalOrders,
      icon: ShoppingCart,
      accent: "text-blue-600",
    },
    {
      label: "Revenue",
      value: metrics?.revenue,
      icon: DollarSign,
      accent: "text-emerald-600",
    },
    {
      label: "Pending Orders",
      value: metrics?.pendingOrders,
      icon: Clock,
      accent: "text-amber-600",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="page-title">Dashboard</h1>
      <p className="text-muted-foreground">
        A quick snapshot of the latest activity and key metrics.
      </p>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {metricsError ? (
            <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              Failed to load metrics: {metricsError?.message || "Unknown error"}
              . Please try again later.
            </div>
          ) : metricsLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-muted/20 p-4"
                >
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                  </div>
                  <Skeleton className="mt-2 h-8 w-16" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-lg border border-border bg-muted/20 p-4 hover:border-primary/40 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-muted-foreground">
                      {kpi.label}
                    </p>
                    <kpi.icon className={`h-4 w-4 ${kpi.accent}`} />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">
                    {kpi.value.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mb-2 text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">
          {recentActivities?.data.length === 0 ? 0 : 1}–
          {recentActivities?.data.length}
        </span>{" "}
        of{" "}
        <span className="font-medium">
          {(
            recentActivities?.pagination.totalActivities ??
            recentActivities?.data.length
          )?.toLocaleString()}
        </span>{" "}
        activities
      </div>

      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">
            Recent Activity
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {isError ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Failed to load recent activities
            </div>
          ) : isLoading ? (
            <div className="space-y-4 px-6 py-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentActivities?.data.length === 0 ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentActivities?.data.map((log) => {
                const actionInfo = getActionInfo(log.action);
                const Icon = actionInfo.icon;
                const timeAgo = formatDistanceToNow(new Date(log.createdAt), {
                  addSuffix: true,
                });

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 px-6 py-4 hover:bg-muted/40 transition-colors"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border",
                        actionInfo.color
                          .replace("text-", "bg-")
                          .replace("-600", "-100") +
                          " dark:" +
                          actionInfo.color
                            .replace("text-", "bg-")
                            .replace("-600", "-950"),
                      )}
                    >
                      <Icon className={cn("h-5 w-5", actionInfo.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        {actionInfo.label.toLowerCase()}{" "}
                        <Badge
                          variant="outline"
                          className="text-xs font-normal ml-1"
                        >
                          {log.entity}
                        </Badge>
                        {log.entityId && (
                          <span className="text-xs text-muted-foreground ml-1.5">
                            #{log.entityId.slice(0, 8)}
                          </span>
                        )}
                      </p>

                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{timeAgo}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
