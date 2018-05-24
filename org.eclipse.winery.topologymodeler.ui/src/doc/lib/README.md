## @Winery/Topologymodeler
This makes the [OpenTOSCA/Winery topologymodeler](https://github.com/OpenTOSCA/winery) module available as npm package.

### Install
`npm install @winery/topologymodeler --save`

### Usage
1. Use Topologymodeler in your app's template to render a TopologyTemplate:
```
<winery-topologymodeler [topologyModelerData]="...">
</winery-topologymodeler>
```

The topologyModelerData has to be of this type:
```
export interface TopologyModelerInputDataFormat {
        configuration: {
            readonly: boolean,
            endpointConfig: TopologyModelerConfiguration
        };
        topologyTemplate: TTopologyTemplate;
        visuals: Visuals;
}

TopologyModelerConfiguration {
    readonly id: string;
    readonly ns: string;
    readonly repositoryURL: string;
    readonly uiURL: string;
    readonly compareTo: string;
}
```

2. Add the `WineryModule` to your app.module.ts:
```
import { WineryModule } from '@winery/topologymodeler';

...

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    WineryModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
