/**
 * Fires event if app is loaded.
 */
export declare class AppReadyEventService {
    private doc;
    private isAppReady;
    constructor(doc: any);
    /**
     * Fires event if the app has done loading
     */
    trigger(): void;
    /**
     * Creates a custom event.
     * @param eventType
     * @param bubbles
     * @param cancelable
     */
    private createEvent(eventType, bubbles, cancelable);
}
