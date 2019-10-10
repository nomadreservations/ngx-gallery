import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-gallery-action',
  template: `
    <div
      class="ngx-gallery-icon"
      [class.ngx-gallery-icon-disabled]="disabled"
      aria-hidden="true"
      title="{{ titleText }}"
      (click)="handleClick($event)"
    >
      <i class="ngx-gallery-icon-content {{ icon }}"></i>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NgxGalleryActionComponent {
  @Input() icon: string;
  @Input() disabled = false;
  @Input() titleText = '';

  @Output() clicked: EventEmitter<Event> = new EventEmitter();

  handleClick(event: Event) {
    if (!this.disabled) {
      this.clicked.emit(event);
    }

    event.stopPropagation();
    event.preventDefault();
  }
}
