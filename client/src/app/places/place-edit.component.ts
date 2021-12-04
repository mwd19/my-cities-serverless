import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseFormComponent } from '../base.form.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Place } from './place';
import { PlaceService } from './place.service';
import { ApiResult } from '../base.service';

@Component({
  selector: 'app-place-edit',
  templateUrl: './place-edit.component.html',
  styleUrls: ['./place-edit.component.css']
})
export class PlaceEditComponent
  extends BaseFormComponent implements OnInit, OnDestroy {

  // the view title
  title: string;

  // the form model
  form: FormGroup;

  // the place object to edit or create
  place: Place;

  // the place object id, as fetched from the active route:
  // It's NULL when we're adding a new place,
  // and not NULL when we're editing an existing one.
  id?: number;

  // the countries observable for the select (using async pipe)
  // countries: Observable<ApiResult<Country>>;

  // Activity Log (for debugging purposes)
  activityLog: string = '';

  // Notifier subject (to avoid memory leaks)
  private destroySubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService) {
    super();
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      latitude: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      longitude: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
      ]),
      city: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required)
    }, null);

    // react to form changes
    this.form.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.form.dirty) {
          this.log("Form Model has been loaded.");
        }
        else {
          this.log("Form was updated by the user.");
        }
      });

    // react to changes in the form.name control
    this.form.get("name")!.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe(() => {
        if (!this.form.dirty) {
          this.log("Name has been loaded with initial values.");
        }
        else {
          this.log("Name was updated by the user.");
        }
      });

    this.loadData();
  }

  ngOnDestroy() {
    // emit a value with the takeUntil notifier
    this.destroySubject.next(true);
    // unsubscribe from the notifier itself
    this.destroySubject.unsubscribe();
  }

  log(str: string) {
    this.activityLog += "["
      + new Date().toLocaleString()
      + "] " + str + "<br />";
  }

  loadData() {

    // load countries
    // this.loadCountries();

    // retrieve the ID from the 'id'
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      // EDIT MODE

      // fetch the place from the server
      this.placeService.get<Place>(this.id).subscribe(result => {
        this.place = result;
        this.title = "Edit - " + this.place.name;

        // update the form with the place value
        this.form.patchValue(this.place);
      }, error => console.error(error));
    }
    else {
      // ADD NEW MODE

      this.title = "Create a new Place";
    }
  }

  // loadCountries() {
  //   // fetch all the countries from the server
  //   this.countries = this.cityService
  //     .getCountries<ApiResult<Country>>(
  //       0,
  //       9999,
  //       "name",
  //       null,
  //       null,
  //       null,
  //     );
  // }

  onSubmit() {

    var place = (this.id) ? this.place : <Place>{};

    place.name = this.form.get("name").value;
    place.latitude = Number(this.form.get("latitude").value);
    place.longitude = Number(this.form.get("longitude").value);
    place.city = this.form.get("city").value;
    place.country = this.form.get("country").value;

    if (this.id) {
      // EDIT mode
      this.placeService
        .put<Place>(place)
        .subscribe(result => {

          console.log("Place " + place.id + " has been updated.");

          // go back to places view
          this.router.navigate(['/places']);
        }, error => console.error(error));
    }
    else {
      // ADD NEW mode
      this.placeService
        .post<Place>(place)
        .subscribe(result => {

          console.log("Place " + result.id + " has been created.");

          // go back to places view
          this.router.navigate(['/places']);
        }, error => console.error(error));
    }
  }

  isDupePlace(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      var place = <Place>{};
      place.id = (this.id) ? this.id : 0;
      place.name = this.form.get("name").value;
      place.latitude = this.form.get("latitude").value;
      place.longitude = this.form.get("longitude").value;
      place.city = this.form.get("city").value;
      place.country = this.form.get("country").value;

      return this.placeService.isDupePlace(place)
        .pipe(map(result => {
          return (result ? { isDupePlace: true } : null);
        }));
    }
  }
}
