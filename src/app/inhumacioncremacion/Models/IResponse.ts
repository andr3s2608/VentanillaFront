export interface IResponse<T> {
  message: string;
  count: number;
  responseTime: Date;
  data: T;
  code: number;
}
