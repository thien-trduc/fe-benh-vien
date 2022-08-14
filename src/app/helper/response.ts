export class BaseRespone<T> {
    pageIndex: number;
    pageSize: number;
    total: number;
    rows: T[];
}