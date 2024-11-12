<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  Column,
} from "@tanstack/vue-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Component, PropType, ref } from "vue";
import {
  FlexRender,
  getCoreRowModel,
  useVueTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/vue-table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

import { valueUpdater } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-vue-next";
import DataTablePagination from "./data-table-pagination.vue";
import DataTableColumnToggle from "./data-table-column-toggle.vue";
import DynaTableColumnToggle from "./DynaTableColumnToggle.vue";
import DynaTablePagination from "./DynaTablePagination.vue";
import DynaTableFacetedFilter from "./DynaTableFacetedFilter.vue";
import { DataTableFacetedFilter } from "./DynaTableFacetedFilter.vue";

const props = defineProps({
  columns: {
    type: Array as PropType<ColumnDef<TData, TValue>[]>,
    required: true,
  },
  data: {
    type: Array as PropType<TData[]>,
    required: true,
  },
  searchBar: {
    type: Boolean,
    default: false,
  },
  searchFor: {
    type: String,
    default: "",
  },
  extraFacetedFilter: {
    type: Array as PropType<FacetedFilter[]>,
    default: () => [],
  },
});

type FacetedFilter = {
  columnId: string;
  title: string;
  hasUniqueOptions: boolean;
  options: {
    label: string;
    value: string;
    icon: Component;
  }[];
};

const sorting = ref<SortingState>([]);

const columnFilters = ref<ColumnFiltersState>([]);

const columnVisibility = ref<VisibilityState>({});

const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
  onColumnFiltersChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnFilters),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnVisibilityChange: (updaterOrValue) =>
    valueUpdater(updaterOrValue, columnVisibility),

  state: {
    get sorting() {
      return sorting.value;
    },
    get columnFilters() {
      return columnFilters.value;
    },
    get columnVisibility() {
      return columnVisibility.value;
    },
  },
});
</script>

<template>
  <div class="flex items-center py-4 justify-between">
    <div v-if="searchBar">
      <Input
        class="max-w-sm"
        :placeholder="`Search ${
          searchFor?.split('_')[searchFor?.split('_').length - 1]
        }...`"
        :model-value="table.getColumn(searchFor || '')?.getFilterValue() as string"
        @update:model-value="
          table.getColumn(searchFor || '')?.setFilterValue($event)
        "
      />
    </div>
    <div class="flex items-end space-x-2">
      <DynaTableFacetedFilter
        v-for="factedFilter in extraFacetedFilter"
        key="filter"
        :has-unique-options="factedFilter.hasUniqueOptions"
        :column="table.getColumn(factedFilter.columnId)"
        :options="factedFilter.options"
        :title="factedFilter.title"
      />
      <DynaTableColumnToggle :table="table" />
    </div>
  </div>
  <div class="border rounded-md mb-4">
    <Table>
      <TableHeader>
        <TableRow
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <TableHead v-for="header in headerGroup.headers" :key="header.id">
            <FlexRender
              v-if="!header.isPlaceholder"
              :render="header.column.columnDef.header"
              :props="header.getContext()"
            />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <template v-if="table.getRowModel().rows?.length">
          <TableRow
            v-for="row in table.getRowModel().rows"
            :key="row.id"
            :data-state="row.getIsSelected() ? 'selected' : undefined"
          >
            <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
              <FlexRender
                :render="cell.column.columnDef.cell"
                :props="cell.getContext()"
              />
            </TableCell>
          </TableRow>
        </template>
        <template v-else>
          <TableRow>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </template>
      </TableBody>
    </Table>
  </div>
  <DynaTablePagination :table="table" />
</template>
