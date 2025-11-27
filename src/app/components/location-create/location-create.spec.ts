import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationCreate } from './location-create';

describe('LocationCreate', () => {
  let component: LocationCreate;
  let fixture: ComponentFixture<LocationCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
