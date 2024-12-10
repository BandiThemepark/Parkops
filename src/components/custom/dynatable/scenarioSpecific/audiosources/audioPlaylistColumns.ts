import { AudioPlaylist, AudioSource } from "@/lib/backendTypes";
import { ColumnDef } from "@tanstack/vue-table";
import DynaTableColumnHeader from "../../DynaTableColumnHeader.vue";
import { h } from "vue";
import AudioPlayer from "@/components/custom/AudioPlayer.vue";
import DynaTableAudioSourceDropdown from "./DynaTableAudioSourceDropdown.vue";
import Badge from "@/components/ui/badge/Badge.vue";
import RegionHoverCard from "./RegionHoverCard.vue";
import DynaTableAudioPlaylistDropdown from "./DynaTableAudioPlaylistDropdown.vue";

export const audioPlaylistColumns = (props: {
  updateData: () => any;
}): ColumnDef<AudioPlaylist>[] => [
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
    id: "isActive",
    accessorKey: "audioSources",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Total tracks" }),
    cell: ({ row, column }) => {
      const original = row.original as AudioPlaylist;
      return h(
        Badge,
        { variant: "outline" },
        () => original.audioSources!.length.toString() + " tracks"
      );
    },
  },
  {
    id: "regions",
    accessorKey: "region",
    header: ({ column }) =>
      h(DynaTableColumnHeader, { column: column, title: "Region" }),
    cell: ({ row, column }) => {
      const original = row.original as AudioPlaylist;
      const isActive = original.audioSources!.length > 0;
      return h(RegionHoverCard, { regions: original.region });
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const audioPlaylist = row.original;
      return h(
        "div",
        { class: "relative text-right" },
        h(DynaTableAudioPlaylistDropdown, {
          audioPlaylist: audioPlaylist,
          onRefreshAudioSources: props.updateData,
          onExpand: row.toggleExpanded,
        })
      );
    },
  },
];
