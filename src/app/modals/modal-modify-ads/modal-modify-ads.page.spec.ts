import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalModifyAdsPage } from './modal-modify-ads.page';

describe('ModalModifyAdsPage', () => {
  let component: ModalModifyAdsPage;
  let fixture: ComponentFixture<ModalModifyAdsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalModifyAdsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalModifyAdsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
