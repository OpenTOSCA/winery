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

  private nodeNameKeyUp: Subject<string> = new Subject<string>();

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
        type: ''
      }
    }));
  };

  ngOnInit() {
    this.sidebarSubscription = this.$ngRedux.select(state => state.wineryState.sidebarContents)
      .subscribe(newValue => {
          this.sidebarState = newValue;
          if (!this.sidebarState.nameTextFieldValue) {
            this.sidebarState.nameTextFieldValue = this.sidebarState.id;
          }
          if (newValue.sidebarVisible) {
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
            type: this.sidebarState.type
          }
        }));
      });
  }

  minInstancesChanged() {
  }

  maxInstancesChanged() {
  }
}
