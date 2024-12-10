<script lang="ts" setup>
import { computed, PropType, ref, watch } from "vue";
import { ColumnFilter, TableColumn } from "./dynamictable";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { Button } from "../../ui/button";
import Skeleton from "../../ui/skeleton/Skeleton.vue";
const props = defineProps({
  header: {
    type: Array as PropType<TableColumn[]>,
    required: true,
  },
  data: {
    type: Array as PropType<{ id: string; [key: string]: any }[]>,
    required: true,
  },
  maxLines: {
    type: Number,
    default: 10,
  },
  hasActions: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  filters:{
    type: Array as PropType<ColumnFilter[]>,
    default: []
  }
});

watch(
  () => props.data,
  (newData) => {
    sortedData.value = newData;
    pages.value = paginate(sortedData.value);
  }
);


const sortedData = ref(props.data);
const sortByColumn = ref<null | TableColumn>(null);
const sortDirection = ref<"asc" | "desc">("asc");

const pages = ref<Array<TableColumn[]>>([]);

// 0 is the first page
const currentPage = ref(0);

const paginate = (data: any[]) => {
  const pages: TableColumn[][] = [];
  let currentPage: TableColumn[] = [];
  let currentLine = 0;
  data.forEach((row) => {
    if (currentLine >= props.maxLines) {
      pages.push(currentPage);
      currentPage = [];
      currentLine = 0;
    }
    currentPage.push(row);
    currentLine++;
  });
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }
  return pages;
};
const getValueBySelector = (obj: any, selector: string) => {
    const x =  selector?.split('.').reduce((acc, key) => {
      return acc && acc[key]
    }, obj);

    return x;
  }
const setFilter = (columnName: string) => {
  if (sortByColumn.value?.objectSelector === columnName) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortByColumn.value = props.header.find(
      (column) => column.objectSelector === columnName
    )!;
    sortDirection.value = "asc";
  }

  // filter "props.data" by the filter prop

  const filteredData = props.data.filter((row) => {

    let isMatch = true;
    props.filters.forEach((filter) => {
      if (filter.value !== "") {
        if (!(row[filter.column] as string).toLowerCase().includes(filter.value.toLowerCase()) ) {
          isMatch = false;
        }
      }
    });

    return isMatch;

  })
  

  // function getValueBySelector(obj, selector) {
  //   console.log(obj, selector)
  //   return selector?.split('.').reduce((acc, key) => {
  //   console.log(acc, key)
  //   return acc && acc[key]
  //   }, obj);
  // }

  // Now we have the filtered data, we need to order them by the selected column
  const sortedData = filteredData.sort((a, b) => {

    // @ts-ignore
    if (getValueBySelector(a, sortByColumn.value?.objectSelector) < getValueBySelector(b, sortByColumn.value?.objectSelector)) {
      return sortDirection.value === "asc" ? -1 : 1;
    }
    // @ts-ignore
    if (getValueBySelector(a, sortByColumn.value?.objectSelector) > getValueBySelector(b, sortByColumn.value?.objectSelector)) {
      return sortDirection.value === "asc" ? 1 : -1;
    }

    // // @ts-ignore
    // if (a[sortByColumn.value?.objectSelector] < b[sortByColumn.value?.objectSelector]) {
    //   return sortDirection.value === "asc" ? -1 : 1;
    // }
    // // @ts-ignore
    // if (a[sortByColumn.value?.objectSelector] > b[sortByColumn.value?.objectSelector]) {
    //   return sortDirection.value === "asc" ? 1 : -1;
    // }
    return 0;
  });


  pages.value = paginate(sortedData);
};

watch(
  () => props.filters,
  (newFilters) => {
    setFilter(sortByColumn.value?.objectSelector ?? "");
  }
);

const nextPage = () => {
  if (pages.value[currentPage.value + 1] !== undefined) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (pages.value[currentPage.value - 1] !== undefined) {
    currentPage.value--;
  }
};

(async () => {
  sortedData.value = props.data;
  pages.value = paginate(sortedData.value);
})();

const hasNextPage = computed(() => {
  return pages.value[currentPage.value + 1] != undefined;
});

const hasPrevPage = computed(() => {
  return pages.value[currentPage.value - 1] != undefined;
});
</script>

<template>
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead
          v-for="column in props.header"
          :key="column.name"
          :class="{ 'text-right': column.alignedRight }"
        >
          <Button
            @click="setFilter(column.objectSelector)"
            variant="ghost"
            v-if="column.sortable"
            size="sm"
            :class="{
              '-ml-3': !column.alignedRight,
              '-mr-3': column.alignedRight,
            }"
          >
            {{ column.name }}
            <span v-if="sortByColumn?.name != column.name">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </span>
            <span
              v-else-if="
                sortByColumn.name == column.name && sortDirection == 'asc'
              "
              class="ml-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m4.5 15.75 7.5-7.5 7.5 7.5"
                />
              </svg>
            </span>
            <span
              v-else-if="
                sortByColumn.name == column.name && sortDirection == 'desc'
              "
              class="ml-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="size-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </span>
          </Button>
          <span v-else>{{ column.name }}</span>
        </TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow
        v-if="!isLoading"
        v-for="(row, index) in pages[currentPage]"
        :key="index"
        :class="{ 'text-right': row.alignedRight }"
      >
        <TableCell
          v-for="column in props.header"
          :key="column.name"
          :class="{ 'text-right': column.alignedRight }"
        >
        <!-- implement getValueBySelector -->
         
        <div v-if="column.format != undefined" v-html="column.format(getValueBySelector((row as Record<string, any>),column.objectSelector))">
          </div>
          <div v-else>
            {{getValueBySelector((row as Record<string, any>),column.objectSelector)}}
          </div>
        </TableCell>
      </TableRow>
      <TableRow v-else v-for="i in maxLines" :key="i">
        <TableCell v-for="column in props.header" :key="column.name">
          <Skeleton class="w-full h-[20px]" />
        </TableCell>
      </TableRow>
    </TableBody>
  </Table>
  <div class="flex justify-end space-x-3 mt-4">
    <Button
      @click="prevPage"
      size="sm"
      :disabled="!hasPrevPage || isLoading"
      variant="secondary"
      >Previous</Button
    >
    <Button
      @click="nextPage"
      size="sm"
      :disabled="!hasNextPage || isLoading"
      variant="secondary"
      >Next</Button
    >
  </div>
</template>
 