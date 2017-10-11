// Import the core angular services.
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// Import the rxJs modules for their side-effects.
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/do';

export interface ILoaded {
  isLoaded: boolean;
}

@Injectable()
export class LoadedService {

  constructor() { }

  /**
   * Getter for loading state
   * @returns stream
   */
  public getLoadingState(): Observable<ILoaded> {
    const stream = Observable
      .of({isLoaded: true})
      .do(() => console.log('loading started...'))
      .delay(1500)
      .do(() => console.log('loading finished after 1.5s'));
    return stream;
  }

}
