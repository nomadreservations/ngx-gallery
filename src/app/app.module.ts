import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxGalleryModule } from '../../projects/gallery/src';
import { AppComponent } from './app.component';
import { OptionsViewerComponent } from './options-viewer/options-viewer.component';

@NgModule({
  declarations: [AppComponent, OptionsViewerComponent],
  imports: [BrowserModule, NgxGalleryModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
