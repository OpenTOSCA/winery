import { Component } from '@angular/core';
import { TopologyModelerInputDataFormat } from '../topologyModelerInputDataFormat';
import { topologytemplate, visuals } from '../mockdata/mockdata';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  mockData: TopologyModelerInputDataFormat = {
    configuration: {
      endpointConfig: {
        id: 'FoodProvider',
        ns: 'http://www.opentosca.org/providers/FoodProvider',
        repositoryURL: 'http://localhost:8080/winery',
        uiURL: 'http://localhost:8080/',
        compareTo: null
      },
      // endpointConfig: undefined,
      readonly: false
    },
    // topologyTemplate: topologytemplate,
    topologyTemplate: undefined,
    // visuals: visuals,
    visuals: undefined
  };
}
