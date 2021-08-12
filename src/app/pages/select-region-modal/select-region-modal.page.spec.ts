import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectRegionModalPage } from './select-region-modal.page';

describe('SelectRegionModalPage', () => {
  let component: SelectRegionModalPage;
  let fixture: ComponentFixture<SelectRegionModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectRegionModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectRegionModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
