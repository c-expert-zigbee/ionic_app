import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyadsEditPage } from './myads-edit.page';

describe('MyadsEditPage', () => {
  let component: MyadsEditPage;
  let fixture: ComponentFixture<MyadsEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyadsEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyadsEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
