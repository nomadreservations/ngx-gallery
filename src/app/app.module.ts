import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { NgxGalleryModule } from '../../projects/gallery/src';
import { AppComponent } from './app.component';
import { OptionsViewerComponent } from './options-viewer/options-viewer.component';

@NgModule({
  declarations: [AppComponent, OptionsViewerComponent],
  imports: [BrowserModule, NgxGalleryModule, Ng2PageScrollModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
