import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalThankyouPage } from './modal-thankyou.page';

describe('ModalThankyouPage', () => {
  let component: ModalThankyouPage;
  let fixture: ComponentFixture<ModalThankyouPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalThankyouPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalThankyouPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
