import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { BaseFormComponent } from '../base.form.component';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Place } from './place';
import { PlaceService } from './place.service';

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
  id?: string;

  // the countries observable for the select (using async pipe)
  // countries: Observable<ApiResult<Country>>;

  // Activity Log (for debugging purposes)
  activityLog: string = '';

  // Notifier subject (to avoid memory leaks)
  private destroySubject: Subject<boolean> = new Subject<boolean>();

  selectedFiles: FileList;

  countries: any[];
  selectedCountry: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private placeService: PlaceService) {
    super();

    this.countries = [
      "",
      "Afghanistan",
      "Albania",
      "Algeria",
      "American Samoa",
      "Andorra",
      "Angola",
      "Anguilla",
      "Antarctica",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Aruba",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas (the)",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bermuda",
      "Bhutan",
      "Bolivia (Plurinational State of)",
      "Bonaire, Sint Eustatius and Saba",
      "Bosnia and Herzegovina",
      "Botswana",
      "Bouvet Island",
      "Brazil",
      "British Indian Ocean Territory (the)",
      "Brunei Darussalam",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cayman Islands (the)",
      "Central African Republic (the)",
      "Chad",
      "Chile",
      "China",
      "Christmas Island",
      "Cocos (Keeling) Islands (the)",
      "Colombia",
      "Comoros (the)",
      "Congo (the Democratic Republic of the)",
      "Congo (the)",
      "Cook Islands (the)",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Curaçao",
      "Cyprus",
      "Czechia",
      "Côte d'Ivoire",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic (the)",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Falkland Islands (the) [Malvinas]",
      "Faroe Islands (the)",
      "Fiji",
      "Finland",
      "France",
      "French Guiana",
      "French Polynesia",
      "French Southern Territories (the)",
      "Gabon",
      "Gambia (the)",
      "Georgia",
      "Germany",
      "Ghana",
      "Gibraltar",
      "Greece",
      "Greenland",
      "Grenada",
      "Guadeloupe",
      "Guam",
      "Guatemala",
      "Guernsey",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Heard Island and McDonald Islands",
      "Holy See (the)",
      "Honduras",
      "Hong Kong",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran (Islamic Republic of)",
      "Iraq",
      "Ireland",
      "Isle of Man",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jersey",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Korea (the Democratic People's Republic of)",
      "Korea (the Republic of)",
      "Kuwait",
      "Kyrgyzstan",
      "Lao People's Democratic Republic (the)",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macao",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands (the)",
      "Martinique",
      "Mauritania",
      "Mauritius",
      "Mayotte",
      "Mexico",
      "Micronesia (Federated States of)",
      "Moldova (the Republic of)",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Montserrat",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands (the)",
      "New Caledonia",
      "New Zealand",
      "Nicaragua",
      "Niger (the)",
      "Nigeria",
      "Niue",
      "Norfolk Island",
      "Northern Mariana Islands (the)",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine, State of",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines (the)",
      "Pitcairn",
      "Poland",
      "Portugal",
      "Puerto Rico",
      "Qatar",
      "Republic of North Macedonia",
      "Romania",
      "Russian Federation (the)",
      "Rwanda",
      "Réunion",
      "Saint Barthélemy",
      "Saint Helena, Ascension and Tristan da Cunha",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Martin (French part)",
      "Saint Pierre and Miquelon",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Sint Maarten (Dutch part)",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Georgia and the South Sandwich Islands",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan (the)",
      "Suriname",
      "Svalbard and Jan Mayen",
      "Sweden",
      "Switzerland",
      "Syrian Arab Republic",
      "Taiwan",
      "Tajikistan",
      "Tanzania, United Republic of",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tokelau",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Turks and Caicos Islands (the)",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates (the)",
      "United Kingdom of Great Britain and Northern Ireland (the)",
      "United States Minor Outlying Islands (the)",
      "United States of America (the)",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Venezuela (Bolivarian Republic of)",
      "Viet Nam",
      "Virgin Islands (British)",
      "Virgin Islands (U.S.)",
      "Wallis and Futuna",
      "Western Sahara",
      "Yemen",
      "Zambia",
      "Zimbabwe",
      "Åland Islands"
    ];
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

    // retrieve the ID from the 'id'
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);
    
    if (this.id) {
      // EDIT MODE

      // fetch the place from the server
      this.placeService.get<Place>(this.id).subscribe(result => {
        console.log(result);
        
        this.place = result.place;
        this.title = "Edit - " + this.place.name;

        // update the form with the place value
        this.form.patchValue(this.place);
      }, error => { 
        console.error(error);
        alert(error.error.message);
      });
    }
    else {
      // ADD NEW MODE

      this.title = "Create a new Place";
    }
  }

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
        }, error => { 
          console.error(error);
          alert(error.error.message);
        }
      );
    }
    else {
      // ADD NEW mode
      this.placeService
        .post<Place>(place)
        .subscribe(result => {

          console.log("Place " + result.id + " has been created.");

          // go back to places view
          this.router.navigate(['/places']);
        }, error => { 
          console.error(error);
          alert(error.error.message);
        }
      );
    }
  }

  upload() {

    console.log(this.id);
      
    var place = (this.id) ? this.place : <Place>{};

      const file = this.selectedFiles.item(0);
      console.log(file);
      try {
        if (!file) {
          alert('File should be selected')
          return
        }
        
        console.log(this.id);
        this.placeService.getUploadUrl(this.id).subscribe(
          uploadUrl => {
            console.log(uploadUrl);
            this.placeService.uploadFile(uploadUrl.uploadUrl, file).subscribe( () =>
              { alert('File was uploaded!'); }
            )
          }
        )

      } catch (e) {
        alert('Could not upload a file: ')
      }
  }
    
  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
}
