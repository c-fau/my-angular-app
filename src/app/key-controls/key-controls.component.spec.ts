import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KeyControlsComponent } from './key-controls.component';

describe('KeyControlsComponent', () => {
  let component: KeyControlsComponent;
  let fixture: ComponentFixture<KeyControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KeyControlsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KeyControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
