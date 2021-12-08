import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseService {
    constructor(public http: HttpClient) {
    }

    abstract getData<T>(): Observable<T[]>;
    abstract get<T>(id: string): Observable<T>;
    abstract put<T>(item: T): Observable<T>;
    abstract post<T>(item: T): Observable<T>;
    abstract delete<T>(id: string): Observable<void>;
}