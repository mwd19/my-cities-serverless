import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { Subject } from 'rxjs';

import { Place } from './place';
import { PlaceService } from './place.service';

import { SelectItem } from 'primeng/api';
import { PrimeNGConfig } from 'primeng/api';
declare var google: any

@Component({
  selector: 'app-places',
  templateUrl: './places.component.html',
  styleUrls: ['./places.component.scss']
})
export class PlacesComponent implements OnInit {

  public places: Place[];

  public optionsTab: any[] = [];
  public overlays: any[] = [];
  public infoWindow: any;

  countries: any[];
  selectedCountry: any;

  filterTextChanged: Subject<string> = new Subject<string>();

  sortOptions: SelectItem[];
  sortOrder: number;
  sortField: string;

  constructor(private placeService: PlaceService, private primengConfig: PrimeNGConfig) {
  }

  ngOnInit() {
    this.loadData();

    // this.options = {
    //   center: { lat: 36.9177, lng: 30.7854 },
    //   zoom: 12
    // };
    // // this.overlays = [new google.maps.Marker({ position: { lat: 36.15, lng: 5.43333 }, title: "Konyaaltiiiiiiii" })];
    // this.initOverlays();
    // this.infoWindow = new google.maps.InfoWindow();

    // this.options = {
    //       center: {lat: 36.890257, lng: 30.707417},
    //       zoom: 12
    //   };

    this.overlays = [
      new google.maps.Marker({ position: { lat: 36.879466, lng: 30.667648 }, title: "Konyaalti" }),
      new google.maps.Marker({ position: { lat: 36.883707, lng: 30.689216 }, title: "Ataturk Park" }),
      new google.maps.Marker({ position: { lat: 36.885233, lng: 30.702323 }, title: "Oldtown" }),
      new google.maps.Polygon({
        paths: [
          { lat: 36.9177, lng: 30.7854 }, { lat: 36.8851, lng: 30.7802 }, { lat: 36.8829, lng: 30.8111 }, { lat: 36.9177, lng: 30.8159 }
        ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
      }),
      new google.maps.Circle({ center: { lat: 36.90707, lng: 30.56533 }, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1500 }),
      new google.maps.Polyline({ path: [{ lat: 36.86149, lng: 30.63743 }, { lat: 36.86341, lng: 30.72463 }], geodesic: true, strokeColor: '#FF0000', strokeOpacity: 0.5, strokeWeight: 2 })
    ];

    this.primengConfig.ripple = true;
  }

  initOptions() {
    this.places.forEach(place => {
      this.optionsTab.push({
        center: { lat: place.latitude, lng: place.longitude },
        zoom: 12
      })
    });
  }

  initOverlays() {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = [
        new google.maps.Marker({ position: { lat: 36.15, lng: 5.43333 }, title: "Konyaalti" }),
        new google.maps.Polygon({
          paths: [
            { lat: 36.9177, lng: 30.7854 }, { lat: 36.8851, lng: 30.7802 }, { lat: 36.8829, lng: 30.8111 }, { lat: 36.9177, lng: 30.8159 }
          ], strokeOpacity: 0.5, strokeWeight: 1, fillColor: '#1976D2', fillOpacity: 0.35
        }),
      ];
    }
  }

  loadData() {
    this.getData();
  }

  getData() {

    this.placeService.getData<Place>()
      .subscribe(result => {
        this.places = result.items;
        console.log(this.places);
      }, error => {
        console.error(error);
        alert(error.error.message);
      });
  }

  onPlaceDelete(placeId: string) {
    try {
      this.placeService.delete(placeId).subscribe(result => {
        alert("Place " + placeId + " has been deleted.");
        console.log("Place " + placeId + " has been deleted.");
        this.loadData();
      }, error => {
        console.error(error);
        alert(error.error.message);
      });
    } catch {
      alert('Place deletion failed');
    }
  }

}
