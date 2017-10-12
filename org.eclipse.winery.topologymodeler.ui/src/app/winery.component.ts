/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Thommy Zelenik, Josip Ledic - initial API and implementation
 */
import 'rxjs/add/operator/do';
import { Component, OnInit } from '@angular/core';
import { TNodeTemplate, TRelationshipTemplate } from './ttopology-template';
import { IWineryState } from './redux/store/winery.store';
import { WineryActions } from './redux/actions/winery.actions';
import { NgRedux } from '@angular-redux/store';
import { ILoaded, LoadedService } from './loaded.service';
import { AppReadyEventService } from './app-ready-event.service';
import { HotkeysService } from 'angular2-hotkeys';
import { BackendService } from './backend.service';
import { QName } from './qname';

/**
 * This is the root component of the topology modeler.
 */
@Component({
  selector: 'winery-topologymodeler',
  templateUrl: './winery.component.html',
  styleUrls: ['./winery.component.css']
})
export class WineryComponent implements OnInit {
  serviceTemplate: any;
  visuals: any;
  nodeTemplates: Array<TNodeTemplate> = [];
  relationshipTemplates: Array<TRelationshipTemplate> = [];

  public loaded: ILoaded;

  constructor(private ngRedux: NgRedux<IWineryState>,
              private actions: WineryActions,
              private loadedService: LoadedService,
              private appReadyEvent: AppReadyEventService,
              private backendService: BackendService) {
    // Loading Animation
    this.loaded = null;
    this.loadedService.getLoadingState()
      .subscribe((isAppLoaded) => {
        this.loaded = isAppLoaded;
        this.appReadyEvent.trigger();
      });

  }

  ngOnInit() {
    this.backendService.serviceTemplate$.subscribe(data => {
      let visualData;
      this.backendService.visuals$.subscribe(data2 => {
        visualData = data2;
        this.visuals = visualData;
        this.initNodeTemplates(data.nodeTemplates, visualData);
        console.log(data.nodeTemplates);
      });
      console.log(data.relationshipTemplates);
      this.initRelationshipTemplates(data.relationshipTemplates);
    });
  }

  initNodeTemplates(nodeTemplateArray: Array<any>, visuals: any) {
    for (const node of nodeTemplateArray) {
      let color;
      let imageUrl;
      for (const visual of visuals) {
        if (visual.localName === node.name) {
          color = visual.color;
          imageUrl = visual.imageUrl;
        }
      }
      this.nodeTemplates.push(
        new TNodeTemplate(
          undefined,
          node.id,
          node.type,
          node.name,
          node.minInstances,
          node.maxInstances,
          color,
          imageUrl,
          node.documentation,
          node.any,
          node.otherAttributes,
          node.x,
          node.y
        )
      );
    }
    for (const nodeTemplate of this.nodeTemplates) {
      this.ngRedux.dispatch(this.actions.saveNodeTemplate(nodeTemplate));
    }
  }

  initRelationshipTemplates(relationshipTemplateArray: Array<any>) {
    for (const relationship of relationshipTemplateArray) {
      const relationshipType = new QName(relationship.type).localName;
      this.relationshipTemplates.push(
        new TRelationshipTemplate(
          relationship.sourceElement.ref,
          relationship.targetElement.ref,
          relationship.name,
          `${relationship.sourceElement.ref}_${relationshipType}_${relationship.targetElement.ref}`,
          relationshipType,
          relationship.documentation,
          relationship.any,
          relationship.otherAttributes
        )
      );
    }
    for (const relationshipTemplate of this.relationshipTemplates) {
      this.ngRedux.dispatch(this.actions.saveRelationship(relationshipTemplate));
    }
  }
}


