type TableColumn = {
  name: string;
  sortable: boolean;
  objectSelector: string;
  alignedRight?: boolean;
  format?: (value: any) => string;
};

type ColumnFilter = {
  column: string;
  value: string;
};

export type { TableColumn, ColumnFilter };
