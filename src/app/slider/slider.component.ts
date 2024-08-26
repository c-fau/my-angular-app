import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-slider',
  standalone: true,
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss', './slider-vertical.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class SliderComponent {
  @Input() steering = {
    min: -30,
    max: 30,
    step: 1,
    value: 0,
  };
  @Input() gas = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
  };
  @Input() brake = {
    min: 0,
    max: 100,
    step: 1,
    value: 0,
  };

  trackValue(slider: any): string {
    // Calculate percentage distance from 0 to current value
    const percentage = ((slider.value - 0) / (slider.max - slider.min)) * 100;
    return `${Math.round(percentage)}%`;
  }
  sliderGreaterThanZero(): boolean {
    return this.steering.value > 0;
  }
  sliderLessThanZero(): boolean {
    return this.steering.value < 0;
  }
}
