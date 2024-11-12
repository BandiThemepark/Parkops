import { Player } from "@/lib/backendTypes";
import { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DynaTableColumnHeader from "../../DynaTableColumnHeader.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import DynaTablePlayersDropdown from "./DynaTablePlayersDropdown.vue";
import DynaTableExpandButton from "../../DynaTableExpandButton.vue";

export const playerColums: ColumnDef<Player>[] = [
  {
    id: "playername",
    accessorKey: "playername",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Playername" }),
    cell: ({ row, column }) => {
      const player = row.original;
      return h("div", { class: " flex ites-center space-x-2" }, [
        h(
          "div",
          { class: "overflow-hidden rounded w-fit" },
          h("img", {
            src: `https://crafatar.com/avatars/${player.uuid}?size=24&scale=1&default=MHF_Steve&overlay`,
          })
        ),

        h("span", { class: "mr-2" }, player.playername),
      ]);
    },
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const player = row.original;

      return h("div", { class: "relative text-right space-x-2" }, [
        h(DynaTableExpandButton, {
          onExpand: row.toggleExpanded,
          isExpanded: row.getIsExpanded(),
        }),
        h(DynaTablePlayersDropdown, { player, onExpand: row.toggleExpanded }),
      ]);
    },
  },
];
