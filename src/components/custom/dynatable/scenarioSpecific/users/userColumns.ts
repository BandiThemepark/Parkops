import { Player } from "@/lib/backendTypes";
import { ColumnDef } from "@tanstack/vue-table";
import { h } from "vue";
import DynaTableColumnHeader from "../../DynaTableColumnHeader.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import { User } from "firebase/auth";
import DynaTableUserDropdown from "./DynaTableUserDropdown.vue";

export type BandiUser = User & { customClaims: { role: string } };

export const userColumns: ColumnDef<BandiUser>[] = [
  {
    id: "username",
    accessorKey: "displayName",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Username" }),
    cell: ({ row, column }) => {
      const user = row.original;
      return h("div", { class: " flex ites-center space-x-2" }, [
        h(
          "div",
          { class: "overflow-hidden rounded w-fit" },
          h("img", {
            src: `https://api.dicebear.com/9.x/thumbs/svg?seed=${user.uid}`,
          })
        ),

        h(
          "span",
          { class: "mr-2" },
          user.displayName ? user.displayName : "No name"
        ),
      ]);
    },
  },
  {
    id: "email",
    accessorKey: "email",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Email" }),
    cell: ({ row, column }) => {
      const user = row.original;
      return h("div", { class: " flex ites-center space-x-2" }, [
        h("span", { class: "mr-2" }, user.email ? user.email : "No email"),
      ]);
    },
  },
  {
    id: "role",
    accessorKey: "customClaims.role",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Role" }),
    cell: ({ row, column }) => {
      const user = row.original;
      const role: string = user.customClaims
        ? user.customClaims["role"]
        : "No role";
      const capitalizedRole =
        role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();

      return h("div", { class: " flex ites-center space-x-2" }, [
        h(Badge, { class: "mr-2" }, () => capitalizedRole),
      ]);
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

      return h("div", { class: "relative text-right space-x-2" }, [
        h(DynaTableUserDropdown, { user, onExpand: row.toggleExpanded }),
      ]);
    },
  },
];
