import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CapabilitiesComponent } from './capabilities.component';

describe('CapabilitiesComponent', () => {
  let component: CapabilitiesComponent;
  let fixture: ComponentFixture<CapabilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CapabilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CapabilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
