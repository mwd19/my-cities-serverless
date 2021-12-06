import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseService {
    constructor(public http: HttpClient) {
    }

    abstract getData<ApiResult>(
        pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string,
        filterQuery: string): Observable<ApiResult>;

    abstract get<T>(id: string): Observable<T>;
    abstract put<T>(item: T): Observable<T>;
    abstract post<T>(item: T): Observable<T>;
    abstract delete<T>(id: string): Observable<void>;
}

export interface ApiResult<T> {
    data: T[];
    pageIndex: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    sortColumn: string;
    sortOrder: string;
    filterColumn: string;
    filterQuery: string;
}
