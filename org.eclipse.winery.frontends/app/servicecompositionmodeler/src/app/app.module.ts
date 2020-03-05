/*******************************************************************************
 * Copyright (c) 2017-2019 Contributors to the Eclipse Foundation
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
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { JsPlumbService } from './services/jsPlumb.service';
import { HttpServiceTemplates } from './services/httpClient';


import { AppComponent } from './app.component';
import { TopBarComponent } from './component/top-bar/top-bar.component';
import { SideBarComponent } from './component/side-bar/side-bar.component';
import { CanvasComponent } from './component/canvas/canvas.component';

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
      SideBarComponent,
      CanvasComponent
  ],
  imports: [
    BrowserModule,
      HttpClientModule,
  ],
  providers: [JsPlumbService, HttpServiceTemplates],
  bootstrap: [AppComponent]
})
export class AppModule { }
