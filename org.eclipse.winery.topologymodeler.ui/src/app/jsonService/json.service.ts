import { Injectable, OnInit } from '@angular/core';
import { Visuals } from '../ttopology-template';

/**
 * Distributes the JSON from the server to the app.
 */
@Injectable()
export class JsonService implements OnInit {

  testJson: any;
  visuals: Visuals[];
  mockNodesArray = [
    {
      documentation: [],
      any: [],
      otherAttributes: {},
      id: 'test',
      type: '{http://winery.opentosca.org/test/nodetypes/fruits}test',
      name: 'test',
      minInstances: 1,
      maxInstances: 1
    }
  ];
  mockRelationshipsArray = [
    {
      'sourceElement': 'baobab',
      'targetElement': 'tree'
    }
  ];
  mockVisuals = [{
    imageUrl: 'http://www.example.org/winery/test/nodetypes/' +
    'http%253A%252F%252Fwinery.opentosca.org%252Ftest%252Fnodetypes%252Ffruits/baobab/appearance/50x50',
    color: '#89ee01',
    nodeTypeId: '{http://winery.opentosca.org/test/nodetypes/fruits}baobab',
    localName: ''
  }];

  /**
   * Returns the relationships coming from the server.
   * @returns any The relationshipTemplates.
   */
  getRelationships(): any {
      return this.testJson.relationshipTemplates;

  }

  /**
   * Returns the nodeTemplates coming from the server.
   * @returns any The nodeTemplates.
   */
  getNodes(): any {
      return this.testJson.nodeTemplates;

  }

  /**
   * Returns the visuals coming from the server.
   * @returns any The visuals.
   */
  getVisuals(): any {
      return this.visuals;

  }
  /**
   * Setter for the data coming from the server.
   * @param visuals The visuals.
   * @param topologyTemplate The topologyTemplates containing relations and nodes.
   */
  setData(visuals: any, topologyTemplate: any) {
    // This causes "type not compatible error"
    this.visuals = visuals;
    this.testJson = topologyTemplate;
  }

  /**
   * Setter for the visuals coming from the server.
   * @param visuals The visuals.
   */
  setVisuals(visuals: any) {
    this.visuals = visuals;
    // TODO Josip: replace with proper QName implementation: Parse localName from QName
    for (const visual of this.visuals) {
      visual.localName = visual.nodeTypeId.split('}')[1];
    }
  }
  /**
   * Setter for the topologyTemplates coming from the server.
   * @param topologyTemplate The topologyTemplates containing relations and nodes.
   */
  setTopologyTemplate(topologyTemplate: any) {
    this.testJson = topologyTemplate;
  }

  constructor() {
  }

  /**
   * Angular lifecycle event.
   */
  ngOnInit() {
    // TODO visual local name

  }

}
