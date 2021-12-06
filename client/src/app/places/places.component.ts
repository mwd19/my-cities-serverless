import { Component, Inject, OnInit, ViewChild } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { Place } from './place';
import { PlaceService } from './place.service';
import { ApiResult } from '../base.service';

import {SelectItem} from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {
  public displayedColumns: string[] = ['id', 'name', 'latitude', 'longitude', 'city', 'country'];
  public places: Place[];

  selectedPlace: Place;
  displayDialog: boolean;

  defaultPageIndex: number = 0;
  defaultPageSize: number = 10;
  public defaultSortColumn: string = "name";
  public defaultSortOrder: string = "asc";

  defaultFilterColumn: string = "name";
  filterQuery: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  filterTextChanged: Subject<string> = new Subject<string>();

  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;

  constructor(private placeService: PlaceService, private primengConfig: PrimeNGConfig) {
  }

  ngOnInit() {
    this.loadData(null);

    this.sortOptions = [
      {label: 'Name High to Low', value: '!price'},
      {label: 'Name Low to High', value: 'price'}
    ];
    this.primengConfig.ripple = true;
  }

  selectPlace(event: Event, place: Place) {
    console.log(place);
    this.selectedPlace = place;
    this.displayDialog = true;
    event.preventDefault();
  }

  onDialogHide() {
    this.selectedPlace = null;
  }

  // debounce filter text changes
  onFilterTextChanged(filterText: string) {
    if (this.filterTextChanged.observers.length === 0) {
      this.filterTextChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(query => {
          this.loadData(query);
        });
    }
    this.filterTextChanged.next(filterText);
  }

  loadData(query: string = null) {
    var pageEvent = new PageEvent();
    pageEvent.pageIndex = this.defaultPageIndex;
    pageEvent.pageSize = this.defaultPageSize;
    if (query) {
      this.filterQuery = query;
    }
    this.getData(pageEvent);
  }

  getData(event: PageEvent) {

    var sortColumn = (this.sort)
      ? this.sort.active
      : this.defaultSortColumn;

    var sortOrder = (this.sort)
      ? this.sort.direction
      : this.defaultSortOrder;

    var filterColumn = (this.filterQuery)
      ? this.defaultFilterColumn
      : null;

    var filterQuery = (this.filterQuery)
      ? this.filterQuery
      : null;

    this.placeService.getData<ApiResult<Place>>(
      event.pageIndex,
      event.pageSize,
      sortColumn,
      sortOrder,
      filterColumn,
      filterQuery
      )
      .subscribe(result => {
        // this.paginator.length = result.totalCount;
        // this.paginator.pageIndex = result.pageIndex;
        // this.paginator.pageSize = result.pageSize;
        console.log(result.items);
        this.places = result.items;
        console.log(this.places); 
      }, error => console.error(error));
  }

  onPlaceDelete(placeId: string) {
    try {
      this.placeService.delete(placeId).subscribe(result => {
        alert("Place " + placeId + " has been deleted.");
        console.log("Place " + placeId + " has been deleted.");
        this.loadData(null);
      }, error => console.error(error));
    } catch {
      alert('Todo deletion failed')
    }
  }

}
