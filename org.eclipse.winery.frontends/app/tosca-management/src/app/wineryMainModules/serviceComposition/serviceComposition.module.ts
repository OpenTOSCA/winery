/*******************************************************************************
 * Copyright (c) 2019 Contributors to the Eclipse Foundation
 *
 * See the NOTICE file(s) distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0, or the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: EPL-2.0 OR Apache-2.0
 *******************************************************************************/


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceCompositionRouterModule } from './serviceCompositionRouter.module';
import { WineryLoaderModule } from '../../wineryLoader/wineryLoader.module';
import { WineryModalModule } from '../../wineryModalModule/winery.modal.module';
import { WineryUploaderModule } from '../../wineryUploader/wineryUploader.module';
import { FormsModule } from '@angular/forms';
import { WineryTableModule } from '../../wineryTableModule/wineryTable.module';
import { WineryReadmeModule } from '../../wineryReadmeModule/wineryReadme.module';
import { WineryLicenseModule } from '../../wineryLicenseModule/wineryLicense.module';
import { WinerySourceModule } from '../../instance/sharedComponents/artifactSource/source.module';
import { WineryEditorModule } from '../../wineryEditorModule/wineryEditor.module';
import { HttpModule } from '@angular/http';
import { TabsModule } from 'ngx-bootstrap';
import { InstanceModule } from '../../instance/instance.module';
import { TopologyTemplateModule } from '../../instance/sharedComponents/topologyTemplate/topologyTemplate.module';
import { ServiceCompositionWorkflowModule } from '../../instance/sharedComponents/serviceCompositionWorkflow/serviceCompositionWorkflow.module';
import { ServiceCompositionParametersModule } from '../../instance/sharedComponents/serviceCompositionParameters/serviceCompositionParameters.module';
import { ServiceCompositionDeploymentModule } from '../../instance/sharedComponents/serviceCompositionDeployment/serviceCompositionDeployment.module';

@NgModule({
    imports: [
        HttpModule,
        CommonModule,
        InstanceModule,
        FormsModule,
        WineryLoaderModule,
        WineryModalModule,
        TopologyTemplateModule,
        WineryTableModule,
        WineryUploaderModule,
        WinerySourceModule,
        TabsModule,
        WineryEditorModule,
        WineryReadmeModule,
        WineryLicenseModule,
        ServiceCompositionRouterModule,
        ServiceCompositionParametersModule,
        ServiceCompositionDeploymentModule,
        ServiceCompositionWorkflowModule
    ]
})
export class ServiceCompositionModule {
}
