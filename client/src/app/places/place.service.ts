import { Injectable, Inject } from '@angular/core';
import { HttpBackend, HttpClient, HttpParams } from '@angular/common/http';
import { BaseService, ApiResult } from '../base.service';
import { Observable } from 'rxjs';
import { environment as env } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PlaceService
    extends BaseService {

    private customHttpClient: HttpClient;

    constructor(
        http: HttpClient, backend: HttpBackend) {
        super(http);

        this.customHttpClient = new HttpClient(backend);
    }

    getData<ApiResult>(
        pageIndex: number,
        pageSize: number,
        sortColumn: string,
        sortOrder: string,
        filterColumn: string,
        filterQuery: string
    ): Observable<any> {
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

    get<Place>(id): Observable<any> {
        var url = `${env.dev.serverUrl}` + "places/" + id;
        return this.http.get<Place>(url);
    }

    put<Place>(item): Observable<Place> {
        var url = `${env.dev.serverUrl}` + "places/" + item.placeId;
        var place = { name: item.name, city: item.city, country: item.country }
        return this.http.patch<Place>(url, place);
    }

    post<Place>(item): Observable<Place> {
        var url = `${env.dev.serverUrl}` + "places";
        return this.http.post<Place>(url, item);
    }

    delete<Place>(id): Observable<Place>  {
        var url = `${env.dev.serverUrl}` + "places/" + id;
        return this.http.delete<Place>(url);
    }

    isDupePlace(item): Observable<boolean> {
        var url = `${env.dev.serverUrl}` + "places/isdupeplace";
        return this.http.post<boolean>(url, item);
    }
    
    getUploadUrl(placeId: string): Observable<any> {
        var url = `${env.dev.serverUrl}places/${placeId}/attachment`;
        console.log(url);
        
        return this.http.post<string>(url, '');
    }
      
    uploadFile(uploadUrl: string, file: File): Observable<void> {
        console.log(uploadUrl);
        console.log(file);
        return this.customHttpClient.put<void>(uploadUrl, file);
    }
}
