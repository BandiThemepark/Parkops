type TableColumn = {
  name: string;
  sortable: boolean;
  objectSelector: string;
  alignedRight?: boolean;
  format?: (value: any) => string;
};

export type { TableColumn };
