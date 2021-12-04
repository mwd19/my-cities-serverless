import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaceService
    extends BaseService {
    constructor(
        http: HttpClient) {
        super(http);
    }

    getData<ApiResult>(
        pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string,
        filterQuery: string
    ): Observable<ApiResult> {
        var url = `${env.dev.serverUrl}` + 'places';
        // var params = new HttpParams()
        //     .set("pageIndex", pageIndex.toString())
        //     .set("pageSize", pageSize.toString())
        //     .set("sortColumn", sortColumn)
        //     .set("sortOrder", sortOrder);

        // if (filterQuery) {
        //     params = params
        //         .set("filterColumn", filterColumn)
        //         .set("filterQuery", filterQuery);
        // }

        return this.http.get<ApiResult>(url);
    }

    get<Place>(id): Observable<Place> {
        var url = `${env.dev.serverUrl}` + "places/" + id;
        return this.http.get<Place>(url);
    }

    put<Place>(item): Observable<Place> {
        var url = `${env.dev.serverUrl}` + "places/" + item.id;
        return this.http.put<Place>(url, item);
    }

    post<Place>(item): Observable<Place> {
        var url = `${env.dev.serverUrl}` + "places";
        return this.http.post<Place>(url, item);
    }

    // getPlaces<ApiResult>(
    //     pageIndex: number,
    //     pageSize: number,
    //     sortColumn: string,
    //     sortOrder: string,
    //     filterColumn: string,
    //     filterQuery: string
    // ): Observable<ApiResult> {
    //     var url = apiEndpoint + 'api/Places';
    //     var params = new HttpParams()
    //         .set("pageIndex", pageIndex.toString())
    //         .set("pageSize", pageSize.toString())
    //         .set("sortColumn", sortColumn)
    //         .set("sortOrder", sortOrder);

    //     if (filterQuery) {
    //         params = params
    //             .set("filterColumn", filterColumn)
    //             .set("filterQuery", filterQuery);
    //     }

    //     return this.http.get<ApiResult>(url, { params });
    // }

    isDupePlace(item): Observable<boolean> {
        var url = `${env.dev.serverUrl}` + "places/isdupeplace";
        return this.http.post<boolean>(url, item);
    }
}
