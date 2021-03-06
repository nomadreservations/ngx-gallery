import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { NgxGalleryAction } from './ngx-gallery-action.model';
import { NgxGalleryAnimation } from './ngx-gallery-animation.model';
import { NgxGalleryHelperService } from './ngx-gallery-helper.service';
import { NgxGalleryOrderedImage } from './ngx-gallery-ordered-image.model';

@Component({
  selector: 'ngx-gallery-image',
  template: `
    <div class="ngx-gallery-image-wrapper ngx-gallery-animation-{{ animation }} ngx-gallery-image-size-{{ size }}">
      <div
        class="ngx-gallery-image"
        *ngFor="let image of getImages(); let i = index"
        [ngClass]="{
          'ngx-gallery-active': selectedIndex == image.index,
          'ngx-gallery-inactive-left': selectedIndex > image.index,
          'ngx-gallery-inactive-right': selectedIndex < image.index,
          'ngx-gallery-clickable': clickable
        }"
        [style.background-image]="getSafeUrl(image.src)"
        (click)="handleClick($event, image.index)"
      >
        <div class="ngx-gallery-icons-wrapper">
          <ngx-gallery-action
            *ngFor="let action of actions"
            [icon]="action.icon"
            [disabled]="action.disabled"
            [titleText]="action.titleText"
            (clicked)="action.onClick($event, image.index)"
          ></ngx-gallery-action>
        </div>
        <div
          class="ngx-gallery-image-text"
          *ngIf="showDescription && descriptions[image.index]"
          [innerHTML]="descriptions[image.index]"
          (click)="$event.stopPropagation()"
        ></div>
      </div>
    </div>
    <ngx-gallery-bullets
      *ngIf="bullets"
      [count]="images.length"
      [active]="selectedIndex"
      (changed)="show($event)"
    ></ngx-gallery-bullets>
    <ngx-gallery-arrows
      class="ngx-gallery-image-size-{{ size }}"
      *ngIf="arrows"
      (prevClick)="showPrev()"
      (nextClick)="showNext()"
      [prevDisabled]="!canShowPrev()"
      [nextDisabled]="!canShowNext()"
      [arrowPrevIcon]="arrowPrevIcon"
      [arrowNextIcon]="arrowNextIcon"
    ></ngx-gallery-arrows>
  `,
  styleUrls: ['./ngx-gallery-image.component.scss']
})
export class NgxGalleryImageComponent implements OnInit, OnChanges {
  @Input() images: NgxGalleryOrderedImage[];
  @Input() clickable: boolean;
  @Input() selectedIndex: number;
  @Input() arrows: boolean;
  @Input() arrowsAutoHide: boolean;
  @Input() swipe: boolean;
  @Input() animation: string;
  @Input() size: string;
  @Input() arrowPrevIcon: string;
  @Input() arrowNextIcon: string;
  @Input() autoPlay: boolean;
  @Input() autoPlayInterval: number;
  @Input() autoPlayPauseOnHover: boolean;
  @Input() infinityMove: boolean;
  @Input() lazyLoading: boolean;
  @Input() actions: NgxGalleryAction[];
  @Input() descriptions: string[];
  @Input() showDescription: boolean;
  @Input() bullets: boolean;

  @Output() clicked = new EventEmitter();
  @Output() activeChange = new EventEmitter();

  canChangeImage = true;

  private timer;

  constructor(
    private sanitization: DomSanitizer,
    private elementRef: ElementRef,
    private helperService: NgxGalleryHelperService
  ) {}

  ngOnInit(): void {
    if (this.arrows && this.arrowsAutoHide) {
      this.arrows = false;
    }

    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.swipe) {
      this.helperService.manageSwipe(
        this.swipe,
        this.elementRef,
        'image',
        () => this.showNext(),
        () => this.showPrev()
      );
    }
  }

  @HostListener('mouseenter') onMouseEnter() {
    if (this.arrowsAutoHide && !this.arrows) {
      this.arrows = true;
    }

    if (this.autoPlay && this.autoPlayPauseOnHover) {
      this.stopAutoPlay();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.arrowsAutoHide && this.arrows) {
      this.arrows = false;
    }

    if (this.autoPlay && this.autoPlayPauseOnHover) {
      this.startAutoPlay();
    }
  }

  reset(index: number): void {
    this.selectedIndex = index;
  }

  getImages(): NgxGalleryOrderedImage[] {
    if (!this.images) {
      return [];
    }

    if (this.lazyLoading) {
      const indexes = [this.selectedIndex];
      const prevIndex = this.selectedIndex - 1;

      if (prevIndex === -1 && this.infinityMove) {
        indexes.push(this.images.length - 1);
      } else if (prevIndex >= 0) {
        indexes.push(prevIndex);
      }

      const nextIndex = this.selectedIndex + 1;

      if (nextIndex === this.images.length && this.infinityMove) {
        indexes.push(0);
      } else if (nextIndex < this.images.length) {
        indexes.push(nextIndex);
      }

      return this.images.filter((img, i) => indexes.indexOf(i) !== -1);
    } else {
      return this.images;
    }
  }

  startAutoPlay(): void {
    this.stopAutoPlay();

    this.timer = setInterval(() => {
      if (!this.showNext()) {
        this.selectedIndex = -1;
        this.showNext();
      }
    }, this.autoPlayInterval);
  }

  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  handleClick(event: Event, index: number): void {
    if (this.clickable) {
      this.clicked.emit(index);

      event.stopPropagation();
      event.preventDefault();
    }
  }

  show(index: number) {
    this.selectedIndex = index;
    this.activeChange.emit(this.selectedIndex);
    this.setChangeTimeout();
  }

  showNext(): boolean {
    if (this.canShowNext() && this.canChangeImage) {
      this.selectedIndex++;

      if (this.selectedIndex === this.images.length) {
        this.selectedIndex = 0;
      }

      this.activeChange.emit(this.selectedIndex);
      this.setChangeTimeout();

      return true;
    } else {
      return false;
    }
  }

  showPrev(): void {
    if (this.canShowPrev() && this.canChangeImage) {
      this.selectedIndex--;

      if (this.selectedIndex < 0) {
        this.selectedIndex = this.images.length - 1;
      }

      this.activeChange.emit(this.selectedIndex);
      this.setChangeTimeout();
    }
  }

  setChangeTimeout() {
    this.canChangeImage = false;
    let timeout = 1000;

    if (this.animation === NgxGalleryAnimation.Slide || this.animation === NgxGalleryAnimation.Fade) {
      timeout = 500;
    }

    setTimeout(() => {
      this.canChangeImage = true;
    }, timeout);
  }

  canShowNext(): boolean {
    if (this.images) {
      return this.infinityMove || this.selectedIndex < this.images.length - 1 ? true : false;
    } else {
      return false;
    }
  }

  canShowPrev(): boolean {
    if (this.images) {
      return this.infinityMove || this.selectedIndex > 0 ? true : false;
    } else {
      return false;
    }
  }

  getSafeUrl(image: string): SafeStyle {
    return this.sanitization.bypassSecurityTrustStyle(this.helperService.getBackgroundUrl(image));
  }
}
