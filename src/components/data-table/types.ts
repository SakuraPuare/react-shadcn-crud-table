export interface Page {
  pageNumber?: number;
  pageSize?: number;
  totalPage?: number;
  totalRow?: number;
}

export interface Filter<T> {
  filter: {
    [key in keyof T]?: T[key];
  };
  filterOptions: {
    id: keyof T;
    label: string;
    placeholder?: React.ReactNode;
    options: {
      label: string;
      value: string;
    }[];
  }[];
  search: string | null;
  sort: string | null;
  startDateTime: string | null;
  endDateTime: string | null;
  /** 页码，从 1 开始 */
  page?: number;
  /** 每页数量 */
  size?: number;
}

export interface TimeRange {
  startDateTime?: Date; // 开始日期时间
  endDateTime?: Date; // 结束日期时间
}
