import {Component} from '@angular/core';
import {topologytemplate, visuals} from "../mockdata/mockdata";
import {TopologyModelerInputDataFormat} from "../topologyModelerInputDataFormat";

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
        id: 'FieldProvider',
        ns: 'http:%2F%2Fwww.opentosca.org%2Fproviders%2FFieldProvider',
        repositoryURL: 'http:%2F%2Flocalhost:8080%2Fwinery',
        uiURL: 'http:%2F%2Flocalhost:8080%2F%23%2F',
        compareTo: null
      },
      readonly: true
    },
    topologyTemplate: topologytemplate,
    visuals: visuals
  };
}
