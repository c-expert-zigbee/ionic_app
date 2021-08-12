import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CreateSuccessPage } from './create-success.page';

describe('CreateSuccessPage', () => {
  let component: CreateSuccessPage;
  let fixture: ComponentFixture<CreateSuccessPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateSuccessPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
