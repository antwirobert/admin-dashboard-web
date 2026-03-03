import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { Order } from "@/types";
import { useTable } from "@refinedev/react-table";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

const OrdersList = () => {
  const ordersTable = useTable<Order>({
    columns: useMemo<ColumnDef<Order>[]>(
      () => [
        {
          id: "id",
          accessorKey: "id",
          size: 150,
          header: () => <p>ID</p>,
          cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        },
        {
          id: "status",
          accessorKey: "status",
          size: 150,
          header: () => <p>Status</p>,
          cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        },
        {
          id: "totalAmount",
          accessorKey: "totalAmount",
          size: 150,
          header: () => <p>Total</p>,
          cell: ({ getValue }) => <span>{getValue<number>()}</span>,
        },
        {
          id: "createdAt",
          accessorKey: "createdAt",
          size: 150,
          header: () => <p>Created</p>,
          cell: ({ getValue }) => <span>{getValue<string>()}</span>,
        },
      ],
      [],
    ),
    refineCoreProps: {
      resource: "orders",
      pagination: { mode: "server", pageSize: 10 },
      filters: {
        permanent: [],
      },
      sorters: {
        initial: [{ field: "id", order: "desc" }],
      },
    },
  });

  return (
    <div>
      <DataTable table={ordersTable} />
    </div>
  );
};

export default OrdersList;
