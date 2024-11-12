import { Player } from "@/lib/backendTypes";
import { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DynaTableColumnHeader from "../../DynaTableColumnHeader.vue";
import Badge from "@/components/ui/badge/Badge.vue";

export const playerColums: ColumnDef<Player>[] = [
  {
    id: "playername",
    accessorKey: "playername",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Playername" }),
    cell: ({ row, column }) => row.getValue(column.id),
  },
  {
    id: "role",
    accessorKey: "rank",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Role" }),
    cell: ({ row, column }) => row.getValue(column.id),
  },
  {
    id: "onServer",
    accessorKey: "onServer",

    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Current Server" }),
    cell: ({ row, column }) => {
      return h(
        Badge,
        { variant: "outline" },
        { default: () => row.getValue(column.id) }
      );
    },
  },
  {
    id: "firstJoined",
    accessorKey: "firstJoined",

    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "First visit" }),
    cell: ({ row, column }) => {
      return new Date(row.getValue(column.id)).toLocaleDateString();
    },
  },
];
