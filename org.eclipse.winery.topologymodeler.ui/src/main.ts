import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { WineryModule } from './app/winery.module';
import 'ng2-toastr/ng2-toastr.css';

enableProdMode();
platformBrowserDynamic().bootstrapModule(WineryModule);
