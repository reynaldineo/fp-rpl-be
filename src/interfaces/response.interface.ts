export interface responseAPI {
  status: number;
  message: string;
  data?: any;
  pageNumber?: number;
  pageSize?: number;
  maxPage?: number;
}
