import { Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SliderComponent } from '../slider/slider.component';
import { WheelControlComponent } from '../wheel-control/wheel-control.component';
import { HidService } from '../services/hid-service.service';

import {
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { LedService } from '../services/led-service.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-key-controls',
  standalone: true,
  imports: [
    FontAwesomeModule,
    HttpClientModule,
    SliderComponent,
    WheelControlComponent,
  ],
  providers: [LedService, HidService],
  templateUrl: './key-controls.component.html',
  styleUrl: './key-controls.component.scss',
})
export class KeyControlsComponent {
  constructor(private LedService: LedService, private HidService: HidService) {}

  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;

  defaultColour = 'lightgray';
  activeColour = 'lightGreen';
  iconColours = {
    up: this.defaultColour,
    down: this.defaultColour,
    left: this.defaultColour,
    right: this.defaultColour,
  };
  keyStates: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,

    ArrowLeft: false,
    ArrowRight: false,
  };
  apiStates: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,

    ArrowLeft: false,
    ArrowRight: false,
  };
  apiFailed: { [key: string]: boolean } = {
    ArrowUp: false,
    ArrowDown: false,

    ArrowLeft: false,
    ArrowRight: false,
  };

  steering = {
    min: -30,
    max: 30,
    step: 1,
    value: 0,
  };
  gas = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
  };
  brake = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
  };

  ngOnInit() {
    this.HidService.wheelPosition$.subscribe((position) => {
      this.steering.value = this.ensureNumber(position);
    });
    this.HidService.gasPosition$.subscribe((position) => {
      this.gas.value = this.ensureNumber(position);
    });
    this.HidService.brakePosition$.subscribe((position) => {
      this.brake.value = this.ensureNumber(position);
    });
  }
  private ensureNumber(value: any): number {
    return typeof value === 'number' ? value : 0; // Default to 0 if value is not a number
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        if (!this.keyStates['ArrowUp']) {
          this.toggleLED('up', true);
        }
        this.keyStates['ArrowUp'] = true;
        this.iconColours.up = this.activeColour;
        this.applyTransform('ArrowUp');
        if (
          (this.brake.value > 0 && this.keyStates['ArrowUp']) ||
          (this.gas.value >= 1 && this.gas.value <= 99) ||
          (this.keyStates['ArrowDown'] && this.keyStates['ArrowUp']) ||
          this.keyStates['ArrowDown']
        ) {
          this.gas.value = 0;
          this.brake.value = 0;
        } else {
          this.gas.value = 100;
        }
        //console.log(event.key);
        //console.log(this.keyStates);

        break;
      case 'ArrowDown':
        if (!this.keyStates['ArrowDown']) {
          this.toggleLED('down', true);
        }
        this.keyStates['ArrowDown'] = true;
        this.iconColours.down = this.activeColour;
        if (
          (this.gas.value > 0 && this.keyStates['ArrowDown']) ||
          (this.brake.value >= 1 && this.brake.value <= 99) ||
          (this.keyStates['ArrowDown'] && this.keyStates['ArrowUp']) ||
          this.keyStates['ArrowUp']
        ) {
          this.brake.value = 0;
          this.gas.value = 0;
        } else {
          this.brake.value = 100;
        }

        //console.log(event.key);

        break;
      case 'ArrowLeft':
        if (!this.keyStates['ArrowLeft']) {
          this.toggleLED('left', true);
        }
        this.keyStates['ArrowLeft'] = true;
        this.iconColours.left = this.activeColour;
        if (this.keyStates['ArrowLeft'] && this.keyStates['ArrowRight']) {
          this.steering.value = 0;
        } else {
          this.steering.value = -30;
        }

        //console.log(event.key);

        break;
      case 'ArrowRight':
        if (!this.keyStates['ArrowRight']) {
          this.toggleLED('right', true);
        }
        this.keyStates['ArrowRight'] = true;
        this.iconColours.right = this.activeColour;
        if (this.keyStates['ArrowLeft'] && this.keyStates['ArrowRight']) {
          this.steering.value = 0;
        } else {
          this.steering.value = 30;
        }
        //console.log(event.key);

        break;
    }
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.keyStates['ArrowUp'] = false;
        this.iconColours.up = this.defaultColour;
        //console.log(event.key);
        //console.log(this.keyStates);
        this.toggleLED('up', false);
        this.gas.value = 0;

        break;
      case 'ArrowDown':
        this.keyStates['ArrowDown'] = false;
        //console.log(event.key);
        this.iconColours.down = this.defaultColour;
        this.toggleLED('down', false);
        this.brake.value = 0;

        break;
      case 'ArrowLeft':
        this.keyStates['ArrowLeft'] = false;
        //console.log(event.key);
        this.iconColours.left = this.defaultColour;
        this.toggleLED('left', false);
        this.steering.value = 0;

        break;
      case 'ArrowRight':
        this.keyStates['ArrowRight'] = false;
        //console.log(event.key);
        this.iconColours.right = this.defaultColour;
        this.toggleLED('right', false);
        this.steering.value = 0;

        break;
    }
  }
  applyTransform(key: string) {
    document.getElementById(key)?.classList.add('transform-active');
  }
  applyTransformSuccess(key: string) {
    document.getElementById(key)?.classList.add('transform-success');
  }
  applyTransformFailed(key: string) {
    document.getElementById(key)?.classList.add('transform-failed');
  }

  toggleLED(key: string, state: boolean) {
    this.LedService.setLEDState(key, state).subscribe(
      (response) => {
        console.log('API response for :', key, response);
        let selector: string =
          'Arrow' + key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        this.apiStates[selector] = response.body.State;
        console.log(this.apiStates);
        if (response.status === 200) {
          console.log('success:', response.status);
          this.apiFailed[selector] = false;
          this.applyTransformSuccess(selector);
        } else {
          console.log('failed:', response.status);
          this.apiFailed[selector] = true;
        }
      },
      (error) => {
        let selector: string =
          'Arrow' + key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
        this.apiFailed[selector] = true;

        this.applyTransformFailed('api' + selector);
        console.error('Error occurred:', error);
      }
    );
  }
}
