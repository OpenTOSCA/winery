import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

/**
 * Fires event if app is loaded.
 */
@Injectable()
export class AppReadyEventService {

  private doc: Document;
  private isAppReady: boolean;

  constructor(@Inject(DOCUMENT) doc: any) {
    this.doc = doc;
    this.isAppReady = false;
  }

  /**
   * Fires event if the app has done loading
   */
  public trigger(): void {
    if (this.isAppReady) {
      return;
    }

    const bubbles = true;
    const cancelable = false;

    this.doc.dispatchEvent(this.createEvent('appready', bubbles, cancelable));
    this.isAppReady = true;
  }

  /**
   * Creates a custom event.
   * @param eventType
   * @param bubbles
   * @param cancelable
   */
  private createEvent(eventType: string, bubbles: boolean, cancelable: boolean): Event {
    const customEvent: any = new CustomEvent(eventType, {bubbles: bubbles, cancelable: cancelable});
    return customEvent;
  }
}
