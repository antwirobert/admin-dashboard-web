import { CreateButton } from "@/components/refine-ui/buttons/create";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import SearchInput from "@/components/search-input";
import StatusFilter from "@/components/status-filter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Order } from "@/types";
import { useApiUrl } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Download,
  Package,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

const OrdersList = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const apiUrl = useApiUrl();

  const searchFilters = searchQuery
    ? [{ field: "id", operator: "contains" as const, value: searchQuery }]
    : [];

  const statusFilters =
    selectedStatus !== "all"
      ? [{ field: "status", operator: "eq" as const, value: selectedStatus }]
      : [];

  const ordersTable = useTable<Order>({
    columns: useMemo<ColumnDef<Order>[]>(
      () => [
        {
          id: "id",
          accessorKey: "id",
          header: "Order ID",
          size: 140,
          cell: ({ getValue }) => (
            <div className="font-medium text-slate-900 dark:text-slate-100">
              #{getValue<string | number>()}
            </div>
          ),
          filterFn: "includesString",
        },

        {
          id: "status",
          accessorKey: "status",
          header: "Status",
          size: 140,
          cell: ({ getValue }) => {
            const status = (getValue<string>() || "unknown").toLowerCase();

            const statusConfig: Record<
              string,
              {
                label: string;
                variant:
                  | "default"
                  | "secondary"
                  | "outline"
                  | "destructive"
                  | "success";
                icon: React.ComponentType<any>;
              }
            > = {
              pending: { label: "Pending", variant: "secondary", icon: Clock },
              processing: {
                label: "Processing",
                variant: "default",
                icon: Package,
              },
              completed: {
                label: "Completed",
                variant: "success",
                icon: CheckCircle2,
              },
              cancelled: {
                label: "Cancelled",
                variant: "destructive",
                icon: XCircle,
              },
            };

            const config = statusConfig[status] || {
              label: status,
              variant: "secondary",
              icon: Clock,
            };

            const Icon = config.icon;

            return (
              <Badge
                variant={config.variant as any}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 font-medium",
                  config.variant === "success" &&
                    "bg-green-100 text-green-800 hover:bg-green-100/90 dark:bg-green-900/30 dark:text-green-400",
                  config.variant === "destructive" &&
                    "bg-red-100 text-red-800 hover:bg-red-100/90 dark:bg-red-900/30 dark:text-red-400",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label}
              </Badge>
            );
          },
        },

        {
          id: "totalAmount",
          accessorKey: "totalAmount",
          header: "Total",
          size: 110,
          cell: ({ getValue }) => {
            const amount = getValue<number>() ?? 0;
            return (
              <div className="font-medium tabular-nums">
                $
                {amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            );
          },
        },

        {
          id: "createdAt",
          accessorKey: "createdAt",
          header: "Date",
          size: 180,
          cell: ({ getValue }) => {
            const dateStr = getValue<string>();
            if (!dateStr)
              return <span className="text-muted-foreground">—</span>;

            const date = new Date(dateStr);
            return (
              <div className="flex flex-col text-sm">
                <span className="font-medium">
                  {format(date, "MMM d, yyyy")}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(date, "h:mm a")}
                </span>
              </div>
            );
          },
        },

        {
          id: "actions",
          header: "Actions",
          size: 100,
          cell: ({ row }) => (
            <div className="flex ">
              <ShowButton
                resource="orders"
                recordItemId={row.original.id}
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/90 hover:bg-primary/5"
              >
                <span className="flex items-center gap-1.5">
                  View
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </ShowButton>
            </div>
          ),
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "orders",
      pagination: { mode: "server", pageSize: 10 },
      filters: {
        permanent: [...searchFilters, ...statusFilters],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <ListView>
      <Breadcrumb />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Manage and track all customer orders in one place
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {
            const url = `${apiUrl}/orders/export/csv`;
            window.open(url, "_blank");
          }}
        >
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-1 items-center gap-3">
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <StatusFilter
          setStatusFilter={setSelectedStatus}
          statusFilter={selectedStatus}
        />
      </div>
      <DataTable table={ordersTable} />
    </ListView>
  );
};

export default OrdersList;
