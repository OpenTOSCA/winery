import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { JsPlumbService } from './jsPlumbService';
import { WineryComponent } from './winery.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WineryAlertModule } from './winery-alert/winery-alert.module';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { WineryCustomOption } from './winery-alert/winery-alert-options';
import { PaletteComponent } from './palette/palette.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {JsonService} from './jsonService/json.service';
import { TopologyRendererModule } from './topology-renderer/topology-renderer.module';
import { PropertiesComponent } from './node/properties/properties.component';
import { DeploymentArtifactsComponent } from './node/deployment-artifacts/deployment-artifacts.component';
import { RequirementsCapabilitiesComponent } from './node/requirements-capabilities/requirements-capabilities.component';
import { PoliciesComponent } from './node/policies/policies.component';
import { PrintViewComponent } from './print-view/print-view.component';
import { TargetLocationsComponent } from './node/target-locations/target-locations.component';
import {NgReduxModule, NgRedux, DevToolsExtension} from '@angular-redux/store';
import {IWineryState, INITIAL_IWINERY_STATE, rootReducer} from './redux/store/winery.store';
import {WineryActions} from './redux/actions/winery.actions';
import {TopologyRendererActions} from './redux/actions/topologyRenderer.actions';
import { LoadedService } from './loaded.service';
import { AppReadyEventService } from './app-ready-event.service';
import { HotkeyModule } from 'angular2-hotkeys';
import { BackendService } from './backend.service';

@NgModule({
  declarations: [
    WineryComponent,
    PaletteComponent,
    SidebarComponent,
    PrintViewComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot([{ path: '**', redirectTo: '', pathMatch: 'full' }]),
    BrowserAnimationsModule,
    NgReduxModule,
    BsDropdownModule.forRoot(),
    WineryAlertModule.forRoot(),
    ToastModule.forRoot(),
    AccordionModule.forRoot(),
    TopologyRendererModule.forRoot(),
    HotkeyModule.forRoot()
  ],
  providers: [
    {provide: ToastOptions, useClass: WineryCustomOption},
    JsPlumbService,
    JsonService,
    WineryActions,
    TopologyRendererActions,
    LoadedService,
    AppReadyEventService,
    BackendService
  ],

  bootstrap: [WineryComponent]
})
export class WineryModule {
  constructor(ngRedux: NgRedux<IWineryState>,
              devTools: DevToolsExtension) {
    const storeEnhancers = devTools.isEnabled() ?
      [ devTools.enhancer() ] :
      [];

    ngRedux.configureStore(
      rootReducer,
      INITIAL_IWINERY_STATE,
      [],
      storeEnhancers);
  }
}
