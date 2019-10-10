import { async, TestBed } from '@angular/core/testing';
import { NgxGalleryModule } from '@nomadreservations/ngx-gallery';
import { AppComponent } from './app.component';
import { OptionsViewerComponent } from './options-viewer/options-viewer.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgxGalleryModule],
      declarations: [AppComponent, OptionsViewerComponent]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
