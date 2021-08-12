import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ForgotSuccessPage } from './forgot-success.page';

describe('ForgotSuccessPage', () => {
  let component: ForgotSuccessPage;
  let fixture: ComponentFixture<ForgotSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotSuccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
