import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

@Injectable()
export class AppReadyEventService {

  private doc: Document;
  private isAppReady: boolean;

  constructor(@Inject(DOCUMENT) doc: any) {
    this.doc = doc;
    this.isAppReady = false;
  }

  public trigger(): void {
    if (this.isAppReady) {
      return;
    }

    const bubbles = true;
    const cancelable = false;

    this.doc.dispatchEvent(this.createEvent('appready', bubbles, cancelable));
    this.isAppReady = true;
  }

  private createEvent(eventType: string, bubbles: boolean, cancelable: boolean): Event {
    const customEvent: any = new CustomEvent(eventType, {bubbles: bubbles, cancelable: cancelable});
    return customEvent;
  }
}
