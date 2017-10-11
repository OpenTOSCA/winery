import { AfterViewInit, Directive, ElementRef } from '@angular/core';
import ELK from 'elkjs/lib/elk.bundled.js';
import { TNodeTemplate, TRelationshipTemplate } from './ttopology-template';
import { WineryAlertService } from './winery-alert/winery-alert.service';

@Directive({
  selector: '[wineryLayout]'
})
/**
 * Manages all layouting operations besides drag and drop (this is in canvas.ts)
 */
export class LayoutDirective implements AfterViewInit {
  constructor(private alert: WineryAlertService,
              private elRef: ElementRef) {

  }
  /** TODO YANNIC jsplumb als service injecten
  /**
   * Layouts all nodes (not just the selected ones).
   * Uses ELK.Js which implements sugiyama to layout nodes.
   * @param nodeTemplates
   * @param relationshipTemplates
   * @param jsPlumbInstance
   */
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
      // node.otherAttributes['x'] = left;
      // node.otherAttributes['y'] = top;
      node.x = left;
      node.y = top;
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

  /**
   * This applies the calculated positions to the actual node elements.
   * Uses ELK.Js which implements sugiyama to layout nodes.
   * @param data The data (relationships, nodes) used by the layouting algo.
   * @param nodeTemplates The internal representation of the nodes.
   * @param jsPlumbInstance
   */
  private applyPositions(data: any,
                         nodeTemplates: Array<TNodeTemplate>,
                         jsPlumbInstance: any): void {
    nodeTemplates.forEach((node, index) => {
      // apply the new positions to the nodes
      node.x = data.children[index].x + 40;
      node.y = data.children[index].y + 50;
    });

    this.repaintEverything(jsPlumbInstance);
  }

  /**
   * Aligns all selected elements horizontally.
   * If no element is selected, all elements get aligned horizontal.
   * @param selectedNodes
   * @param jsPlumbInstance
   */
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
        node.y = result;
      });
      this.repaintEverything(jsPlumbInstance);
    } else {
      this.showWarningAlert('You have only one node selected.');
    }
  }

  /**
   * Aligns all selected elements vertically.
   * If no element is selected, all elements get aligned vertical.
   * @param selectedNodes
   * @param jsPlumbInstance
   */
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
        node.x = result;
      });
      this.repaintEverything(jsPlumbInstance);
    } else {
      this.showWarningAlert('You have only one node selected.');
    }
  }

  /**
   * Repaints everything after 1ms.
   * @param jsPlumbInstance
   */
  private repaintEverything(jsPlumbInstance: any): void {
    setTimeout(() => jsPlumbInstance.repaintEverything(), 1);
  }

  /**
   * Shows a warning.
   * @param message The message which is displayed.
   */
  private showWarningAlert(message: string): void {
    this.alert.info(message);
  }

  /**
   * Angular lifecycle event
   */
  ngAfterViewInit() {

  }
}
