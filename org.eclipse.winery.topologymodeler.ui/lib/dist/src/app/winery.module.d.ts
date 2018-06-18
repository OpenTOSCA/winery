import { DevToolsExtension, NgRedux } from '@angular-redux/store';
import { IWineryState } from './redux/store/winery.store';
export declare class WineryModule {
    constructor(ngRedux: NgRedux<IWineryState>, devTools: DevToolsExtension);
}
