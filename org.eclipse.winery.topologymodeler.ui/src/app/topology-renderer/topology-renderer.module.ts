/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Josip Ledic - initial API and implementation
 */
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { NavbarComponent } from '../navbar/navbar.component';
import { NodeComponent } from '../node/node.component';
import { CanvasComponent } from '../canvas/canvas.component';
import { LayoutDirective } from '../layout.directive';
import { WineryAlertModule } from '../winery-alert/winery-alert.module';
import { ToastModule, ToastOptions } from 'ng2-toastr/ng2-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JsonService } from '../jsonService/json.service';
import { JsPlumbService } from '../jsPlumbService';
import { WineryCustomOption } from '../winery-alert/winery-alert-options';
import { TopologyRendererComponent } from './topology-renderer.component';
import { NgReduxModule } from '@angular-redux/store';
import { PropertiesComponent } from '../node/properties/properties.component';
import { RequirementsComponent } from '../node/requirements/requirements.component';
import { TargetLocationsComponent } from '../node/target-locations/target-locations.component';
import { PoliciesComponent } from '../node/policies/policies.component';
import { DeploymentArtifactsComponent } from '../node/deployment-artifacts/deployment-artifacts.component';
import { WineryModalModule } from '../../repositoryUiDependencies/wineryModalModule/winery.modal.module';
import { CapabilitiesComponent } from '../node/capabilities/capabilities.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        HttpModule,
        BrowserAnimationsModule,
        BsDropdownModule.forRoot(),
        WineryAlertModule.forRoot(),
        ToastModule.forRoot(),
        AccordionModule.forRoot(),
        NgReduxModule,
        RouterModule,
        WineryModalModule,
    ],
    declarations: [
        NavbarComponent,
        NodeComponent,
        CanvasComponent,
        LayoutDirective,
        TopologyRendererComponent,
        PropertiesComponent,
        RequirementsComponent,
        TargetLocationsComponent,
        PoliciesComponent,
        DeploymentArtifactsComponent,
        CapabilitiesComponent
    ],
    exports: [
        TopologyRendererComponent
    ],
})
export class TopologyRendererModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TopologyRendererModule,
            providers: [
                {provide: ToastOptions, useClass: WineryCustomOption},
                JsPlumbService,
                JsonService
            ]
        };
    }

    constructor() {
    }
}
