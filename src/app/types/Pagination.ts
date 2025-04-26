export interface IPagingRequest {
  pageNumber: number;
  pageSize: number;
  searchValue?: string;
}

export interface IPaginationResponse<T> {
  totalRecords: number;
  firstRecord: number;
  lastRecord: number;
  totalPage: number;
  data: T;
}

