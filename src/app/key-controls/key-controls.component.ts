import { Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
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
  imports: [FontAwesomeModule, HttpClientModule],
  providers: [LedService],
  templateUrl: './key-controls.component.html',
  styleUrl: './key-controls.component.scss',
})
export class KeyControlsComponent {
  constructor(private LedService: LedService) {}

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
        //console.log(event.key);
        //console.log(this.keyStates);

        break;
      case 'ArrowDown':
        if (!this.keyStates['ArrowDown']) {
          this.toggleLED('down', true);
        }
        this.keyStates['ArrowDown'] = true;
        this.iconColours.down = this.activeColour;
        //console.log(event.key);

        break;
      case 'ArrowLeft':
        if (!this.keyStates['ArrowLeft']) {
          this.toggleLED('left', true);
        }
        this.keyStates['ArrowLeft'] = true;
        this.iconColours.left = this.activeColour;

        //console.log(event.key);

        break;
      case 'ArrowRight':
        if (!this.keyStates['ArrowRight']) {
          this.toggleLED('right', true);
        }
        this.keyStates['ArrowRight'] = true;
        this.iconColours.right = this.activeColour;

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

        break;
      case 'ArrowDown':
        this.keyStates['ArrowDown'] = false;
        //console.log(event.key);
        this.iconColours.down = this.defaultColour;
        this.toggleLED('down', false);

        break;
      case 'ArrowLeft':
        this.keyStates['ArrowLeft'] = false;
        //console.log(event.key);
        this.iconColours.left = this.defaultColour;
        this.toggleLED('left', false);

        break;
      case 'ArrowRight':
        this.keyStates['ArrowRight'] = false;
        //console.log(event.key);
        this.iconColours.right = this.defaultColour;
        this.toggleLED('right', false);

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
