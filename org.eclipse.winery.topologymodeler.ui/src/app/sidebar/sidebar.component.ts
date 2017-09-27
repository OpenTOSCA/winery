import { Component, OnInit } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { IWineryState } from '../redux/store/winery.store';
import { WineryActions } from '../redux/actions/winery.actions';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'winery-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('sidebarAnimationStatus', [
      state('in', style({transform: 'translateX(0)'})),
      transition('void => *', [
        style({transform: 'translateX(100%)'}),
        animate('100ms cubic-bezier(0.86, 0, 0.07, 1)')
      ]),
      transition('* => void', [
        animate('200ms cubic-bezier(0.86, 0, 0.07, 1)', style({
          opacity: 0,
          transform: 'translateX(100%)'
        }))
      ])
    ])
  ]
})
export class SidebarComponent implements OnInit {
  // ngRedux sidebarSubscription
  sidebarSubscription;
  nodeTemplateSubscription;
  sidebarState: any;
  sidebarAnimationStatus: string;
  maxInputEnabled = true;
  min = 1;

  private nodeNameKeyUp: Subject<string> = new Subject<string>();
  private nodeMinInstancesKeyUp: Subject<string> = new Subject<string>();
  private nodeMaxInstancesKeyUp: Subject<string> = new Subject<string>();

  constructor(private $ngRedux: NgRedux<IWineryState>,
              private actions: WineryActions) {
  }

  closeSidebar() {
    this.$ngRedux.dispatch(this.actions.openSidebar({
      sidebarContents: {
        sidebarVisible: false,
        nodeClicked: false,
        id: '',
        nameTextFieldValue: '',
        type: '',
        minInstances: -1,
        maxInstances: -1
      }
    }));
  };

  getInfinityButtonStyle(): string {
    return !this.maxInputEnabled ? '#ffc0c0' : '#e0e0e0';
  }

  ngOnInit() {
    this.sidebarSubscription = this.$ngRedux.select(state => state.wineryState.sidebarContents)
      .subscribe(sidebarContents => {
          this.sidebarState = sidebarContents;
          if (!this.sidebarState.nameTextFieldValue) {
            this.sidebarState.nameTextFieldValue = this.sidebarState.id;
          }
          if (sidebarContents.sidebarVisible) {
            this.sidebarAnimationStatus = 'in';
          }
        }
      );
    this.nodeTemplateSubscription = this.$ngRedux.select(state => state.wineryState.currentJsonTopology.nodeTemplates)
      .subscribe((nodeTemplates) => {

      });
    // apply changes to the node name <input> field with a debounceTime of 300ms
    const nodeNameKeyupObservable = this.nodeNameKeyUp
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(data => {
        if (this.sidebarState.nodeClicked) {
          this.$ngRedux.dispatch(this.actions.changeNodeName({
            nodeNames: {
              newNodeName: data,
              id: this.sidebarState.id
            }
          }));
        } else {
          this.$ngRedux.dispatch(this.actions.updateRelationshipName({
            relData: {
              newRelName: data,
              id: this.sidebarState.id
            }
          }));
        }
        // refresh
        this.$ngRedux.dispatch(this.actions.openSidebar({
          sidebarContents: {
            sidebarVisible: true,
            nodeClicked: this.sidebarState.nodeClicked,
            id: this.sidebarState.id,
            nameTextFieldValue: data,
            type: this.sidebarState.type,
            minInstances: this.sidebarState.minInstances,
            maxInstances: this.sidebarState.maxInstances
          }
        }));
      });
    // minInstances
    const nodeMinInstancesKeyUpObservable = this.nodeMinInstancesKeyUp
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(data => {
        if (this.sidebarState.nodeClicked) {
          this.$ngRedux.dispatch(this.actions.changeMinInstances({
            minInstances: {
              id: this.sidebarState.id,
              count: data
            }
          }));
        }
        // refresh
        this.$ngRedux.dispatch(this.actions.openSidebar({
          sidebarContents: {
            sidebarVisible: true,
            nodeClicked: this.sidebarState.nodeClicked,
            id: this.sidebarState.id,
            nameTextFieldValue: this.sidebarState.name,
            type: this.sidebarState.type,
            minInstances: Number(data),
            maxInstances: this.sidebarState.maxInstances
          }
        }));
      });
    // maxInstances
    const nodeMaxInstancesKeyUpObservable = this.nodeMaxInstancesKeyUp
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe(data => {
        if (this.sidebarState.nodeClicked) {
          this.$ngRedux.dispatch(this.actions.changeMaxInstances({
            maxInstances: {
              id: this.sidebarState.id,
              count: data
            }
          }));
        }
        // refresh
        this.$ngRedux.dispatch(this.actions.openSidebar({
          sidebarContents: {
            sidebarVisible: true,
            nodeClicked: this.sidebarState.nodeClicked,
            id: this.sidebarState.id,
            nameTextFieldValue: this.sidebarState.name,
            type: this.sidebarState.type,
            minInstances: this.sidebarState.minInstances,
            maxInstances: Number(data)
          }
        }));
      });
  }

  minInstancesChanged($event) {
      if ($event === 'inc') {
        this.$ngRedux.dispatch(this.actions.incMinInstances({
          minInstances: {
            id: this.sidebarState.id
          }
        }));
        let number: number = this.sidebarState.minInstances;
        number += 1;
        this.sidebarState.minInstances = number;
      } else if ($event === 'dec') {
        if (this.sidebarState.minInstances === 0) {
          this.sidebarState.minInstances = 0;
        } else {
          this.$ngRedux.dispatch(this.actions.decMinInstances({
            minInstances: {
              id: this.sidebarState.id
            }
          }));
          this.sidebarState.minInstances -= 1;
        }
      }
    // refresh
    this.$ngRedux.dispatch(this.actions.openSidebar({
      sidebarContents: {
        sidebarVisible: true,
        nodeClicked: this.sidebarState.nodeClicked,
        id: this.sidebarState.id,
        nameTextFieldValue: this.sidebarState.name,
        type: this.sidebarState.type,
        minInstances: this.sidebarState.minInstances,
        maxInstances: this.sidebarState.maxInstances
      }
    }));
  }

  maxInstancesChanged($event) {
    if (!(this.sidebarState.maxInstances === '\u221E')) {
      if ($event === 'inc') {
        this.$ngRedux.dispatch(this.actions.incMaxInstances({
          maxInstances: {
            id: this.sidebarState.id
          }
        }));
        let number: number = this.sidebarState.maxInstances;
        number += 1;
        this.sidebarState.maxInstances = number;
      } else if ($event === 'dec') {
        if (this.sidebarState.maxInstances === 0) {
          this.sidebarState.maxInstances = 0;
        } else {
          this.$ngRedux.dispatch(this.actions.decMaxInstances({
            maxInstances: {
              id: this.sidebarState.id
            }
          }));
          this.sidebarState.maxInstances -= 1;
        }
      } else if ($event === 'inf') {
        // infinity
        this.maxInputEnabled = false;
        this.sidebarState.maxInstances = '\u221E';
        this.$ngRedux.dispatch(this.actions.changeMaxInstances({
          maxInstances: {
            id: this.sidebarState.id,
            count: '\u221E'
          }
        }));
      }
    } else {
      this.$ngRedux.dispatch(this.actions.changeMaxInstances({
        maxInstances: {
          id: this.sidebarState.id,
          count: 0
        }
      }));
      this.sidebarState.maxInstances = 0;
      this.maxInputEnabled = true;
    }
    // refresh
    this.$ngRedux.dispatch(this.actions.openSidebar({
      sidebarContents: {
        sidebarVisible: true,
        nodeClicked: this.sidebarState.nodeClicked,
        id: this.sidebarState.id,
        nameTextFieldValue: this.sidebarState.name,
        type: this.sidebarState.type,
        minInstances: this.sidebarState.minInstances,
        maxInstances: this.sidebarState.maxInstances
      }
    }));
  }
}
