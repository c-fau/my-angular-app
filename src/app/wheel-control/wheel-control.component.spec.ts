import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WheelControlComponent } from './wheel-control.component';

describe('WheelControlComponent', () => {
  let component: WheelControlComponent;
  let fixture: ComponentFixture<WheelControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WheelControlComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WheelControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
