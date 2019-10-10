import { Component, Input } from '@angular/core';
import { NgxGalleryOptions } from '@nomadreservations/ngx-gallery';

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'options-viewer',
  templateUrl: './options-viewer.component.html',
  styleUrls: ['./options-viewer.component.scss']
})
export class OptionsViewerComponent {
  visibleCode = false;

  @Input() options: NgxGalleryOptions;

  showCode(): void {
    this.visibleCode = true;
  }

  hideCode(): void {
    this.visibleCode = false;
  }
}
