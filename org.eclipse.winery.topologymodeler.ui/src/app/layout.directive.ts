import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import ELK from 'elkjs/lib/elk.bundled.js';
import { TNodeTemplate, TRelationshipTemplate } from './ttopology-template';
import { WineryAlertService } from './winery-alert/winery-alert.service';

@Directive({
  selector: '[wineryLayout]'
})
export class LayoutDirective implements AfterViewInit {
  constructor(private alert: WineryAlertService,
              private elRef: ElementRef) {

  }

  public layoutNodes(nodeTemplates: Array<TNodeTemplate>,
                     relationshipTemplates: Array<TRelationshipTemplate>,
                     jsPlumbInstance: any): void {
    // These are the input arrays for eclipse layout kernel (ELK).
    const children: any[] = [];
    const edges: any[] = [];

    // get width and height of nodes
    nodeTemplates.forEach((node) => {
      const width = this.elRef.nativeElement.querySelector('#' + node.id).offsetWidth;
      const height = this.elRef.nativeElement.querySelector('#' + node.id).offsetHeight;
      children.push({id: node.id, width: width, height: height});
      // also get their current positions and apply them to the internal list
      const left = this.elRef.nativeElement.querySelector('#' + node.id).offsetLeft;
      const top = this.elRef.nativeElement.querySelector('#' + node.id).offsetTop;
      // apply the old positions to the nodeslist
      node.otherAttributes['x'] = left;
      node.otherAttributes['y'] = top;
    });

    // get source and targets of relationships
    relationshipTemplates.forEach((rel, index) => {
      const sourceElement = rel.sourceElement;
      const targetElement = rel.targetElement;
      edges.push({id: index.toString(), sources: [sourceElement], targets: [targetElement]});
    });

    // initialize elk object which will layout the graph
    const elk = new ELK({});
    const graph = {
      id: 'root',
      properties: {
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': '200',
        'elk.direction': 'DOWN',
        'elk.layered.spacing.nodeNodeBetweenLayers': '200'
      },
      children: children,
      edges: edges,
    };

    const promise = elk.layout(graph);
    promise.then((data) => {
      this.applyPositions(data, nodeTemplates, jsPlumbInstance);
    });
  }

  private applyPositions(data: any,
                         nodeTemplates: Array<TNodeTemplate>,
                         jsPlumbInstance: any): void {
    nodeTemplates.forEach((node, index) => {
      // apply the new positions to the nodes
      node.otherAttributes['x'] = data.children[index].x;
      node.otherAttributes['y'] = data.children[index].y + 40;
    });

    this.repaintEverything(jsPlumbInstance);
  }

  public alignHorizontal(selectedNodes: Array<TNodeTemplate>,
                         jsPlumbInstance: any): void {
    let result;
    // if there is only 1 node selected, do nothing
    if (!( selectedNodes.length === 1)) {
      const topPositions = selectedNodes.map((node) => {
        return this.elRef.nativeElement.querySelector('#' + node.id).offsetTop;
      });
      // add biggest value to smallest and divide by 2, to get the exact middle of both
      result = ((Math.max.apply(null, topPositions) + Math.min.apply(null, topPositions)) / 2);
      // iterate over the nodes again, and apply positions
      selectedNodes.forEach((node) => {
        node.otherAttributes['y'] = result;
      });
      this.repaintEverything(jsPlumbInstance);
    } else {
      this.showWarningAlert('You have only one node selected.');
    }
  }

  public alignVertical(selectedNodes: Array<TNodeTemplate>,
                       jsPlumbInstance: any): void {
    let result;
    // if there is only 1 node selected, do nothing
    if (!( selectedNodes.length === 1)) {
      const topPositions = selectedNodes.map((node) => {
        return this.elRef.nativeElement.querySelector('#' + node.id).offsetLeft;
      });
      // add biggest value to smallest and divide by 2, to get the exact middle of both
      result = ((Math.max.apply(null, topPositions) + Math.min.apply(null, topPositions)) / 2);
      // iterate over the nodes again, and apply positions
      selectedNodes.forEach((node) => {
        node.otherAttributes['x'] = result;
      });
      this.repaintEverything(jsPlumbInstance);
    } else {
      this.showWarningAlert('You have only one node selected.');
    }
  }

  private repaintEverything(jsPlumbInstance: any): void {
    setTimeout(() => jsPlumbInstance.repaintEverything(), 1);
  }

  private showWarningAlert(message: string): void {
    this.alert.info(message);
  }

  ngAfterViewInit() {

  }
}
