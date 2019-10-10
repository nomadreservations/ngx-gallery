import { ElementRef, HostListener, Injectable, Renderer2 } from '@angular/core';

@Injectable()
export class NgxGalleryHelperService {
  private swipeHandlers: Map<string, Array<() => void>> = new Map<string, Array<() => void>>();

  constructor(private renderer: Renderer2) {}

  @HostListener('swipeLeft', ['$event'])
  listenSwipeLeft(event) {}

  manageSwipe(
    status: boolean,
    element: ElementRef,
    id: string,
    nextHandler: () => void,
    prevHandler: () => void
  ): void {
    const handlers = this.getSwipeHandlers(id);

    // swipeleft and swiperight are available only if hammerjs is included
    try {
      if (status && !handlers) {
        this.swipeHandlers.set(id, [
          this.renderer.listen(element.nativeElement, 'swipeleft', () => nextHandler()),
          this.renderer.listen(element.nativeElement, 'swiperight', () => prevHandler())
        ]);
      } else if (!status && handlers) {
        handlers.map(handler => handler());
        this.removeSwipeHandlers(id);
      }
    } catch (e) {}
  }

  validateUrl(url: string): string {
    if (url.replace) {
      // tslint:disable-next-line: quotemark
      return url.replace(new RegExp(' ', 'g'), '%20').replace(new RegExp("'", 'g'), '%27');
    } else {
      return url;
    }
  }

  getBackgroundUrl(image: string) {
    return `url('${this.validateUrl(image)}')`;
  }

  private getSwipeHandlers(id: string): Array<() => void> | undefined {
    return this.swipeHandlers.get(id);
  }

  private removeSwipeHandlers(id: string): void {
    this.swipeHandlers.delete(id);
  }
}
