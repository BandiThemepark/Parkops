import { AudioSource } from "@/lib/backendTypes";
import { ColumnDef } from "@tanstack/vue-table";
import DynaTableColumnHeader from "../../DynaTableColumnHeader.vue";
import { h } from "vue";
import AudioPlayer from "@/components/custom/AudioPlayer.vue";
import DynaTableAudioSourceDropdown from "./DynaTableAudioSourceDropdown.vue";

export const audioSourceColumns = (props: {
  updateData: () => any;
}): ColumnDef<AudioSource>[] => [
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Name" }),
    cell: ({ row, column }) => {
      return row.getValue(column.id);
    },
  },
  {
    id: "length",
    accessorKey: "length",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Length" }),
    cell: ({ row, column }) => {
      return row.getValue(column.id) + "s";
    },
  },
  {
    id: "preview",
    enableHiding: false,
    header: ({ column }) => "Preview",
    cell: ({ row }) => {
      const audioSource = row.original;
      return h(AudioPlayer, { link: `${audioSource.link}?cb=${Date.now()}` });
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const audioSource = row.original;
      return h(
        "div",
        { class: "relative text-right" },
        h(DynaTableAudioSourceDropdown, {
          audioSource: audioSource,
          onRefreshAudioSources: props.updateData,
        })
      );
    },
  },
];
