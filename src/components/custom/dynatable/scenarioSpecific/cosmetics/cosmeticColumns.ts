import { Cosmetic } from "@/lib/backendTypes";
import { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DynaTableColumnHeader from "../../DynaTableColumnHeader.vue";
import DynaTableCosmeticsDropdown from "./DynaTableCosmeticsDropdown.vue";
import DynaTableExpandButton from "../../DynaTableExpandButton.vue";
import { Badge } from "@/components/ui/badge";

export const cosmeticColumns: ColumnDef<Cosmetic>[] = [
  {
    id: "name",
    accessorKey: "displayName",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Name" }),
    cell: ({ row, column }) => {
      const cosmetic = row.original;
      return h(
        "span",
        { class: "mr-2" },
        cosmetic.displayName ? cosmetic.displayName : "No name"
      );
    },
  },
  {
    id: "type",
    accessorKey: "type",

    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Type" }),
    cell: ({ row, column }) => {
      return h(
        Badge,
        { variant: "outline" },
        { default: () => row.getValue(column.id) }
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "searchName",
    accessorKey: "name",

    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "SearchName" }),
    cell: ({ row, column }) => {
      return row.getValue(column.id);
    },
  },
  {
    id: "availablleIn",
    accessorKey: "shops",

    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Available at" }),
    cell: ({ row, column }) => {
      const cosmetic = row.original;
      return `${cosmetic.shops?.length} shop${
        cosmetic.shops?.length === 1 ? "" : "s"
      }`;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const cosmetic = row.original;

      return h("div", { class: "relative text-right space-x-2" }, [
        h(DynaTableExpandButton, { row, onExpand: row.toggleExpanded }),
        ,
        h(DynaTableCosmeticsDropdown, {
          cosmetic,
          onExpand: row.toggleExpanded,
        }),
      ]);
    },
  },
];
