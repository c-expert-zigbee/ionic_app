import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ProfileAdPage } from './profile-ad.page';

describe('ProfileAdPage', () => {
  let component: ProfileAdPage;
  let fixture: ComponentFixture<ProfileAdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileAdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileAdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
