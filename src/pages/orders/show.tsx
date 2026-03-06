import {
  ShowView,
  ShowViewHeader,
} from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Order, User } from "@/types";
import { useGetIdentity, useShow, useUpdate } from "@refinedev/core";
import { format } from "date-fns";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Loader2,
  Package,
  XCircle,
} from "lucide-react";
import { useParams } from "react-router";

const getStatusConfig = (status: string) => {
  const lower = status?.toLowerCase() || "unknown";

  const configs: Record<
    string,
    { label: string; variant: string; icon: any; color: string }
  > = {
    pending: {
      label: "Pending",
      variant: "secondary",
      icon: Clock,
      color: "text-black",
    },
    processing: {
      label: "Processing",
      variant: "default",
      icon: Package,
      color: "text-white dark:text-black",
    },
    completed: {
      label: "Completed",
      variant: "success",
      icon: CheckCircle2,
      color:
        "bg-green-100 text-green-800 hover:bg-green-100/90 dark:bg-green-900/30 dark:text-green-400",
    },
    cancelled: {
      label: "Cancelled",
      variant: "destructive",
      icon: XCircle,
      color:
        "bg-red-100 text-red-800 hover:bg-red-100/90 dark:bg-red-900/30 dark:text-red-400",
    },
  };

  return (
    configs[lower] || {
      label: lower,
      variant: "secondary",
      icon: Clock,
      color: "text-gray-600",
    }
  );
};
const OrdersShow = () => {
  const { id } = useParams();
  const orderId = id ?? "";

  const { data: user } = useGetIdentity<User>();
  const { query: ordersQuery } = useShow<Order>({ resource: "orders" });
  const {
    mutate: updateStatus,
    mutation: { isPending: isUpdating },
  } = useUpdate({
    resource: "orders",
  });

  const orders = ordersQuery.data?.data;
  const isLoading = ordersQuery.isLoading;
  const isError = ordersQuery.isError;

  const statusConfig = getStatusConfig(orders?.status ?? "");

  const StatusBadge = () => (
    <Badge
      variant={statusConfig.variant as any}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1 text-sm font-medium",
        statusConfig.color.includes("text-") && statusConfig.color,
      )}
    >
      <statusConfig.icon className="h-4 w-4" />
      {statusConfig.label}
    </Badge>
  );

  const handleUpdateStatus = async (newStatus: string) => {
    updateStatus({
      id: orderId,
      values: {
        status: newStatus,
        userId: user?.id,
      },
    });
  };

  return (
    <ShowView>
      <ShowViewHeader resource="orders" title="Order Details" />

      {isError ? (
        <Card>
          <CardContent className="pt-6 text-center text-destructive">
            Failed to load order details. Please try again later.
          </CardContent>
        </Card>
      ) : (
        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order Summary
              {isLoading ? <Skeleton className="h-6 w-28" /> : <StatusBadge />}
            </CardTitle>
            <CardDescription>Key information at a glance</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-2/3" />
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Amount
                  </span>
                  <span className="font-semibold">
                    ${orders?.totalAmount?.toLocaleString() ?? "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {orders?.updatedAt
                      ? format(new Date(orders.createdAt), "PPPp")
                      : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Last Updated
                  </span>
                  <span className="font-medium">
                    {orders?.updatedAt
                      ? format(new Date(orders.updatedAt), "PPPp")
                      : "—"}
                  </span>
                </div>

                {!isLoading && orders && (
                  <div className="pt-5 border-t mt-2">
                    <p className="text-sm font-medium mb-3">Actions</p>
                    <div className="flex flex-wrap gap-3">
                      {orders.status?.toLowerCase() === "pending" && (
                        <Button
                          onClick={() => handleUpdateStatus("processing")}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Mark as Processing
                        </Button>
                      )}

                      {orders.status?.toLowerCase() === "processing" && (
                        <Button
                          onClick={() => handleUpdateStatus("completed")}
                          disabled={isUpdating}
                        >
                          {isUpdating ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          Mark as Completed
                        </Button>
                      )}

                      {["pending", "processing"].includes(
                        orders.status?.toLowerCase() ?? "",
                      ) && (
                        <Button
                          variant="outline"
                          className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50"
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to cancel this order? This cannot be undone.",
                              )
                            ) {
                              handleUpdateStatus("cancelled");
                            }
                          }}
                          disabled={isUpdating}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </ShowView>
  );
};

export default OrdersShow;
