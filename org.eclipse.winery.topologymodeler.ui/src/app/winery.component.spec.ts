import { TestBed, async } from '@angular/core/testing';

import { WineryComponent } from './winery.component';
import { TopologyRendererModule } from './topology-renderer/topology-renderer.module';
import { PaletteComponent } from './palette/palette.component';
import { JsonService } from './jsonService/json.service';
import { JsPlumbService } from './jsPlumbService';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('WineryComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WineryComponent,
        PaletteComponent
      ],
      imports: [TopologyRendererModule, BrowserAnimationsModule],
      providers: [JsonService, JsPlumbService]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(WineryComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
