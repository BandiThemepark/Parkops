import { ColumnDef } from "@tanstack/vue-table";
import { h, ref } from "vue";
import DynaTableColumnHeader from "../../DynaTableColumnHeader.vue";
import Button from "@/components/ui/button/Button.vue";
import { FolderDownIcon, ReplaceIcon, Trash2Icon } from "lucide-vue-next";
import { downloadBackup, restoreBackup } from "@/lib/backend/database";
import { useToast } from "@/components/ui/toast";
import EasyTooltip from "@/components/custom/EasyTooltip.vue";

type DatabaseBackup = {
  date: string;
};

const { toast } = useToast();

const putbackBackup = async (date: string) => {
  const data = await restoreBackup(date);
  if (data.status === 200) {
    toast({
      title: "Backup restored",
      description: "The backup was restored successfully",
    });
  } else {
    toast({
      title: "An error occured while restoring the backup.",
      description: "Please see the backend logs!",
      variant: "destructive",
    });
  }
};

const downloadStartBackup = async (date: string) => {
  const data = await downloadBackup(date);

  if (data.status === 200) {
    toast({
      title: "Backup downloaded",
      description: "The backup was downloaded successfully",
    });
  } else {
    toast({
      title: "An error occured while downloading the backup.",
      description: "Please see the backend logs!",
      variant: "destructive",
    });
  }
};
export const dbbackupColumns: ColumnDef<DatabaseBackup>[] = [
  {
    accessorKey: "date",
    id: "date",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Creationdate" }),
    cell: ({ row, column }) => {
      const correctedDateString = (row.getValue(column.id) as string).replace(
        /T(\d{2})-(\d{2})-(\d{2})/,
        (_, hours, minutes, seconds) => `T${hours}:${minutes}:${seconds}`
      );
      return new Date(correctedDateString).toLocaleString();
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dbbackup = row.original;

      return h("div", { class: "flex justify-end gap-2" }, [
        h(
          EasyTooltip,
          { tooltipText: "Delete" },
          {
            default: () =>
              h(
                Button,
                { onClick: () => {}, variant: "outline" },
                { default: () => h(Trash2Icon, { class: "size-4" }) }
              ),
          }
        ),
        h(
          EasyTooltip,
          {
            tooltipText: "Download as zip",
          },
          {
            default: () =>
              h(
                Button,
                {
                  onClick: () => downloadStartBackup(dbbackup.date),
                  variant: "outline",
                },
                { default: () => h(FolderDownIcon, { class: "size-4" }) }
              ),
          }
        ),

        h(
          Button,
          { onClick: () => putbackBackup(dbbackup.date) },
          {
            default: () => [h(ReplaceIcon, { class: "size-4" }), "Restore"],
          }
        ),
      ]);
    },
  },
];
