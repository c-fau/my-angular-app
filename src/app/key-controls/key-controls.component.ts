import { style } from '@angular/animations';
import { Component, HostListener } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faArrowUp,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';
import { Transform } from 'stream';

@Component({
  selector: 'app-key-controls',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './key-controls.component.html',
  styleUrl: './key-controls.component.scss',
})
export class KeyControlsComponent {
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

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowUp':
        this.keyStates['ArrowUp'] = true;
        this.iconColours.up = this.activeColour;
        this.applyTransform('ArrowUp');
        //console.log(event.key);
        //console.log(this.keyStates);

        break;
      case 'ArrowDown':
        this.keyStates['ArrowDown'] = true;
        this.iconColours.down = this.activeColour;
        //console.log(event.key);

        break;
      case 'ArrowLeft':
        this.keyStates['ArrowLeft'] = true;
        this.iconColours.left = this.activeColour;

        //console.log(event.key);

        break;
      case 'ArrowRight':
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

        break;
      case 'ArrowDown':
        this.keyStates['ArrowDown'] = false;
        //console.log(event.key);
        this.iconColours.down = this.defaultColour;

        break;
      case 'ArrowLeft':
        this.keyStates['ArrowLeft'] = false;
        //console.log(event.key);
        this.iconColours.left = this.defaultColour;

        break;
      case 'ArrowRight':
        this.keyStates['ArrowRight'] = false;
        //console.log(event.key);
        this.iconColours.right = this.defaultColour;

        break;
    }
  }
  applyTransform(key: string) {
    document.getElementById(key)?.classList.add('transform-active');
  }
}
