import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularMaterialModule } from '../angular-material.module';
import { of } from 'rxjs';

import { PlacesComponent } from './places.component';
import { Place } from './place';
import { PlaceService } from './place.service';
import { ApiResult } from '../base.service';

describe('PlacesComponent', () => {
  let fixture: ComponentFixture<PlacesComponent>;
  let component: PlacesComponent;

  // async beforeEach(): TestBed initialization
  beforeEach(async(() => {

    // Create a mock placeService object with a mock 'getData' method
    const placeService = jasmine.createSpyObj<PlaceService>(
      'PlaceService', ['getData']
    );

    // Configure the 'getData' spy method
    placeService.getData.and.returnValue(
      // return an Observable with some test data
      of<ApiResult<Place>>(<ApiResult<Place>>{
        data: [
          <Place>{
            name: 'TestPlace1',
            id: 1, lat: 1, lon: 1,
            countryId: 1, city: 'TestCity1', country: 'TestCountry1'
          },
          <Place>{
            name: 'TestPlace2',
            id: 2, lat: 1, lon: 1,
            countryId: 1, city: 'TestCity1', country: 'TestCountry1'
          },
          <Place>{
            name: 'TestPlace3',
            id: 3, lat: 1, lon: 1,
            countryId: 1, city: 'TestCity1', country: 'TestCountry1'
          }
        ],
        totalCount: 3,
        pageIndex: 0,
        pageSize: 10
      }));

    TestBed.configureTestingModule({
      declarations: [PlacesComponent],
      imports: [
        BrowserAnimationsModule,
        AngularMaterialModule,
        RouterTestingModule
      ],
      providers: [
        {
          provide: PlaceService,
          useValue: placeService
        }
      ]
    })
      .compileComponents();
  }));

  // synchronous beforeEach(): fixtures and components setup
  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesComponent);
    component = fixture.componentInstance;

    component.paginator = jasmine.createSpyObj(
      "MatPaginator", ["length", "pageIndex", "pageSize"]
    );

    fixture.detectChanges();
  });

  it('should display a "Places" title', async(() => {
    let title = fixture.nativeElement
      .querySelector('h1');
    expect(title.textContent).toEqual('Places');
  }));

  it('should contain a table with a list of one or more places', async(() => {
    let table = fixture.nativeElement
      .querySelector('table.mat-table');
    let tableRows = table
      .querySelectorAll('tr.mat-row');
    expect(tableRows.length).toBeGreaterThan(0);
  }));
});
