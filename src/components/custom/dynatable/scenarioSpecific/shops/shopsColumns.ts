import { Shop } from "@/lib/backendTypes";
import { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DynaTableColumnHeader from "../../DynaTableColumnHeader.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import DynaTableExpandButton from "../../DynaTableExpandButton.vue";
import DynaTableShopsDropdown from "./DynaTableShopsDropdown.vue";
import DynaTableOpenPageButton from "../../DynaTableOpenPageButton.vue";

const getCurrentDomain = () => {
  return window.location.hostname;
};

export const ShopsColumns = (props: {
  updateData: () => any;
}): ColumnDef<Shop>[] => [
  {
    id: "name",
    accessorKey: "displayName",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Displayname" }),
    cell: ({ row, column }) => {
      return row.getValue(column.id);
    },
  },
  {
    id: "searchName",
    accessorKey: "searchName",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Searchname" }),
    cell: ({ row, column }) => {
      const shop = row.original;
      return shop.name;
    },
  },
  {
    id: "cosmetics",
    accessorKey: "cosmetics",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Cosmetics" }),
    cell: ({ row, column }) => {
      const shop = row.original;
      return h(
        Badge,
        { variant: "outline" },
        { default: () => shop.cosmetics.length.toString() + " items" }
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const shop = row.original;
      return h("div", { class: "relative text-right space-x-2" }, [
        h(DynaTableOpenPageButton, {
          toLink: `shops/${shop.id}`,
        }),
        h(DynaTableShopsDropdown, {
          shop: shop,
          onRefreshShops: props.updateData,
          onExpand: row.toggleExpanded,
          isExpanded: row.getIsExpanded(),
        }),
      ]);
    },
  },
];
