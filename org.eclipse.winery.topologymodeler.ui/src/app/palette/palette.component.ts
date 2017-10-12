import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { PaletteService } from '../palette.service';
import { WineryActions } from '../redux/actions/winery.actions';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { TNodeTemplate } from '../ttopology-template';

/**
 * This is the left sidebar, where nodes can be created from.
 */
@Component({
    selector: 'winery-palette-component',
    templateUrl: './palette.component.html',
    styleUrls: ['./palette.component.css'],
    providers: [PaletteService],
    animations: [
        trigger('paletteItemState', [
            state('shrunk', style({
                display: 'none',
                opacity: '0',
                height: '0px',
            })),
            state('extended', style({
                display: 'block',
                opacity: '1',
                height: '100%',
            })),
            transition('shrunk => extended', animate('200ms ease-out')),
            transition('extended => shrunk', animate('200ms ease-out'))
        ])
    ]
})
export class PaletteComponent implements OnInit, OnDestroy {
    detailsAreHidden = true;
    paletteRootState = 'shrunk';
    paletteItems = [];
    allNodeTemplates: Array<TNodeTemplate> = [];
    nodeTemplatesSubscription;
    paletteOpenedSubscription;

    constructor(private paletteService: PaletteService,
                private ngRedux: NgRedux<IWineryState>,
                private actions: WineryActions) {
        this.nodeTemplatesSubscription = ngRedux.select(state => state.wineryState.currentJsonTopology.nodeTemplates)
            .subscribe(currentNodes => this.addNewNode(currentNodes));
        this.paletteOpenedSubscription = this.ngRedux.select(state => state.wineryState.currentPaletteOpenedState)
            .subscribe(currentPaletteOpened => this.updateState(currentPaletteOpened));
        this.paletteItems = paletteService.getPaletteData();
    }

    /**
     * Adds a new node to the internal representation
     * @param currentNodes
     */
    addNewNode(currentNodes: Array<TNodeTemplate>): void {
        if (currentNodes.length > 0) {
            this.allNodeTemplates.push(currentNodes[currentNodes.length - 1]);
        }
    }

    /**
     * Applies the correct css, depending on if the palette is open or not.
     * @param newPaletteOpenedState
     */
    updateState(newPaletteOpenedState: any) {
        if (!newPaletteOpenedState) {
            this.paletteRootState = 'shrunk';
        } else {
            this.paletteRootState = 'extended';
        }
    }

    /**
     * Angular lifecycle event.
     */
    ngOnInit() {
    }

    /**
     * opens the palette if its closed.
     */
    public openPalette(): void {
        this.detailsAreHidden = false;
        this.toggleRootState();

    }

    /**
     * opens the palette if its closed and vice versa.
     */
    private toggleRootState(): void {
        if (this.paletteRootState === 'shrunk') {
            this.ngRedux.dispatch(this.actions.sendPaletteOpened(true));
        } else {
            this.ngRedux.dispatch(this.actions.sendPaletteOpened(false));
        }
    }

    /**
     * Generates and publishes a new node.
     * @param $event
     */
    publishTitle($event): void {
        const left = ($event.pageX - 108).toString();
        const top = ($event.pageY - 30).toString();
        const name = $event.target.innerHTML;
        const otherAttributes = {
            location: 'undefined',
            x: left,
            y: top
        };
        const y = top;
        const x = left;
        const newId = this.generateId(name);
        const paletteItem: TNodeTemplate = new TNodeTemplate(
            undefined,
            newId,
            undefined,
            name,
            1,
            1,
            'yellow',
            undefined,
            undefined,
            undefined,
            otherAttributes,
            x,
            y
        );
        this.ngRedux.dispatch(this.actions.saveNodeTemplate(paletteItem));
        this.ngRedux.dispatch(this.actions.sendPaletteOpened(false));
    }

    /**
     * Generates a new node id, which must be unique.
     * @param name
     */
    generateId(name: string): string {
        if (this.allNodeTemplates.length > 0) {
            for (let i = this.allNodeTemplates.length - 1; i >= 0; i--) {
                if (name === this.allNodeTemplates[i].name) {
                    const idOfCurrentNode = this.allNodeTemplates[i].id;
                    const numberOfNewInstance = parseInt(idOfCurrentNode.substring(idOfCurrentNode.indexOf('_') + 1), 10) + 1;
                    if (numberOfNewInstance) {
                        const newId = name.concat('_', numberOfNewInstance.toString());
                        return newId;
                    } else {
                        const newId = name.concat('_', '2');
                        return newId;
                    }
                }
            }
            return name;
        } else {
            return name;
        }
    }

    /**
     * Angular lifecycle event.
     */
    ngOnDestroy() {
        this.nodeTemplatesSubscription.unsubscribe();
        this.paletteOpenedSubscription.unsubscribe();
    }
}


