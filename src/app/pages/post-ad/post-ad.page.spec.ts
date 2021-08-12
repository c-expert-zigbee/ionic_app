import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PostAdPage } from './post-ad.page';

describe('PostAdPage', () => {
  let component: PostAdPage;
  let fixture: ComponentFixture<PostAdPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostAdPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PostAdPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
