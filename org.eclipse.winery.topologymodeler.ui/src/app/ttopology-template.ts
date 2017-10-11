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
export class AbstractTTemplate {
  constructor(public documentation?: any,
              public any?: any,
              public otherAttributes?: any) {
  }
}

export class TTopologyTemplate extends AbstractTTemplate {
  nodeTemplates: Array<TNodeTemplate> = [];
  relationshipTemplates: Array<TRelationshipTemplate> = [];
}

export class TNodeTemplate extends AbstractTTemplate {
  constructor(public properties: any,
              public id: string,
              public type: string,
              public name: string,
              public minInstances: number,
              public maxInstances: number,
              public color: string,
              public imageUrl: string,
              documentation?: any,
              any?: any,
              otherAttributes?: any,
              public x?: string,
              public y?: string) {
    super(documentation, any, otherAttributes);
  }
}

export class TRelationshipTemplate extends AbstractTTemplate {
  /*
  get targetElement(): string {
    return this.targetElement;
  }
  get sourceElement(): string {
    return this.sourceElement;
  }
  */
  constructor(public sourceElement: string,
              public targetElement: string,
              public name?: string,
              public id?: string,
              public type?: any,
              documentation?: any,
              any?: any,
              otherAttributes?: any) {
    super(documentation, any, otherAttributes);
  }

}

export class Visuals {

  constructor(public color: string,
              public nodeTypeId: string,
              public localName?: string,
              public imageUrl?: string) {
  }
/*
  get color(): string {
    return this._color;
  }

  set color(value: string) {
    this._color = value;
  }

  get nodeTypeId(): string {
    return this._nodeTypeId;
  }

  set nodeTypeId(value: string) {
    this._nodeTypeId = value;
  }

  get localName(): string {
    this._localName = this._nodeTypeId.split('}')[1];
    return this._localName;
  }

  set localName(value: string) {
    this._localName = value;
  }

  get imageUrl(): string {
    return this._imageUrl;
  }

  set imageUrl(value: string) {
    this._imageUrl = value;
  }
  */
}
