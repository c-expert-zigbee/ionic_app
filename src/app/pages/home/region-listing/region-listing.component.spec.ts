import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RegionListingComponent } from './region-listing.component';

describe('RegionListingComponent', () => {
  let component: RegionListingComponent;
  let fixture: ComponentFixture<RegionListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegionListingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RegionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
