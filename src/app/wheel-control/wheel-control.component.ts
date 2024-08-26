import { Component, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HidService } from '../services/hid-service.service';

@Component({
  selector: 'app-wheel-control',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wheel-control.component.html',
  styleUrl: './wheel-control.component.scss',
})
export class WheelControlComponent {
  constructor(public carControlService: HidService) {}
  wheelRange = 180;
  forceFeedback = 0.25;

  connect() {
    this.carControlService.connectToG29(this.wheelRange, this.forceFeedback);
  }
  setRange(range: number) {
    this.carControlService.setRange(range);
    this.wheelRange = range;
  }
  activateForcefeedback() {
    this.carControlService.activateForcefeedback();
  }
  deactivateForcefeedback() {
    this.carControlService.deactivateForcefeedback();
  }
  setForcefeedback(value: number) {
    this.carControlService.setForcefeedback(value);
    this.forceFeedback = value;
  }

  startReadingData() {
    this.carControlService.readInputData();
  }

  disconnect() {
    this.carControlService.disconnect();
  }
  onWheelRangeSliderChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.wheelRange = Number(input.value);
    this.setRange(this.wheelRange);
  }
  onForceFeedbackSliderChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.forceFeedback = Number(input.value);
    this.setForcefeedback(this.forceFeedback);
  }
}
