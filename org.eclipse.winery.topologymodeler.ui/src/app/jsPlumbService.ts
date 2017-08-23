/**
 * Copyright (c) 2017 University of Stuttgart.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * and the Apache License 2.0 which both accompany this distribution,
 * and are available at http://www.eclipse.org/legal/epl-v10.html
 * and http://www.apache.org/licenses/LICENSE-2.0
 *
 * Contributors:
 *     Thommy Zelenik - initial API and implementation
 */
import { Injectable } from '@angular/core';

declare const jsPlumb: any;

@Injectable()
export class JsPlumbService {

  getJsPlumbInstance(): any {
    jsPlumb.ready(() => {
    });
    return jsPlumb.getInstance({
      PaintStyle: {
        strokeWidth: 2,
        stroke: 'rgba(55,55,55,0.9)',
      },
      Connector: ['StateMachine', {proximityLimit: 600, curviness: 30}],
      Endpoints: [
        ['Blank', {radius: 0}], ['Blank', {radius: 0}]],
      ConnectionsDetachable: false,
      Anchor: 'Continuous',
      Anchors: [
        ['Perimeter', {shape: 'Rectangle'}],
        [ 'Perimeter', { shape: 'Rectangle'} ]
      ],
    });
  }
}
