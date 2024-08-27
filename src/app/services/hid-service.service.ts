import { Injectable, numberAttribute } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { switchMap, distinctUntilChanged, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HidService {
  connectedToWheel = false;
  readingData = false;

  private device: HIDDevice | null = null;
  private wheelPositionSubject = new BehaviorSubject<number>(0);
  public wheelPosition$ = this.wheelPositionSubject.asObservable().pipe(
    distinctUntilChanged(), // Only emit when value changes
    switchMap((value) => this.sendToApi('steering', value))
  );

  private gasPositionSubject = new BehaviorSubject<number>(0);
  public gasPosition$ = this.gasPositionSubject.asObservable().pipe(
    distinctUntilChanged(), // Only emit when value changes
    switchMap((value) => this.sendToApi('motor', value))
  );

  private brakePositionSubject = new BehaviorSubject<number>(0);
  public brakePosition$ = this.brakePositionSubject.asObservable().pipe(
    distinctUntilChanged(), // Only emit when value changes
    switchMap((value) => this.sendToApi('motor', value))
  );

  private wheelPositionSubjectUI = new BehaviorSubject<number>(0);
  public wheelPositionUI$ = this.wheelPositionSubjectUI.asObservable();

  private gasPositionSubjectUI = new BehaviorSubject<number>(0);
  public gasPositionUI$ = this.gasPositionSubjectUI.asObservable();

  private brakePositionSubjectUI = new BehaviorSubject<number>(0);
  public brakePositionUI$ = this.brakePositionSubjectUI.asObservable();

  private sendToApi(type: string, value: number) {
    return this.http.post(`http://pitwo:8000/car/${type}`, { value }).pipe(
      catchError((error) => {
        console.error('API call failed', error);
        return of(null); // Return an empty observable in case of error
      })
    );
  }

  updateWheelPosition(newPosition: number) {
    this.wheelPositionSubject.next(newPosition);
    this.wheelPositionSubjectUI.next(newPosition);
  }
  updateGasPosition(newPosition: number) {
    this.gasPositionSubject.next(newPosition);
    this.gasPositionSubjectUI.next(newPosition);
  }
  updateBrakePosition(newPosition: number) {
    this.brakePositionSubject.next(newPosition);
    this.brakePositionSubjectUI.next(newPosition);
  }
  constructor(private http: HttpClient) {}

  // Optional: method to get the current wheelPosition synchronously
  get wheelPosition(): number {
    return this.wheelPositionSubject.getValue();
  }
  get gasPosition(): number {
    return this.gasPositionSubject.getValue();
  }
  get brakePosition(): number {
    return this.brakePositionSubject.getValue();
  }

  async connectToG29(wheelRange: number, forceFeedback: number) {
    if (navigator.hid) {
      const devices = await navigator.hid.requestDevice({
        filters: [{ vendorId: 0x046d, productId: 0xc24f }], // Replace with Logitech G29 vendor and product ID
      });

      if (devices.length > 0) {
        try {
          this.device = devices[0];
          await this.device.open();
          console.log('G29 connected:', this.device);
          this.connectedToWheel = true;
          this.setForcefeedback(forceFeedback);
          this.setRange(wheelRange);
        } catch (e) {
          console.log('error:: ', e);
        }
      }
    } else {
      console.error('WebHID is not supported by your browser.');
      this.connectedToWheel = false;
    }
  }

  async readInputData() {
    if (this.device && this.device.opened) {
      this.device.addEventListener('inputreport', (event) => {
        const { data } = event;
        const input = new Uint8Array(data.buffer);
        //console.log('G29 input data:', input);
        // Process the input data (steering wheel, pedals, etc.)
        this.readingData = true;

        const wheelRotation = (input[5] << 8) | input[4];
        const gasPedal = input[6];
        const brakePedal = input[7];

        const nomalizedGasPosition = this.normalizePedalPosition(gasPedal);
        const normalizedBrakePosition = this.normalizePedalPosition(brakePedal);

        const normalizedWheelRotation =
          this.normalizeWheelPosition(wheelRotation);

        this.updateWheelPosition(Math.round(normalizedWheelRotation));
        this.updateGasPosition(Math.round(nomalizedGasPosition));
        this.updateBrakePosition(Math.round(-normalizedBrakePosition));

        //console.log('Raw Wheel Rotation:', wheelRotation);
        //console.log('Normalized Wheel Rotation:', normalizedWheelRotation);
        //console.log(nomalizedGasPosition);
        //console.log(normalizedBrakePosition);
      });
    }
  }
  normalizeWheelPosition(position: number): number {
    // Normalize the position to a range of -30.0 to 30.0 (optional)
    let value: number = ((position - 32767) / 32767) * 30;
    if (value > 30) {
      return 30;
    }
    if (value < -30) {
      return -30;
    } else {
      return value;
    }
  }
  normalizePedalPosition(position: number): number {
    let value = Math.max(0, Math.min(position, 255));
    let normalized = (1.0 - value / 255) * 100;

    if (normalized > 90) {
      return 100;
    }
    if (normalized < 5) {
      return 0;
    } else {
      return normalized;
    }
  }

  setRange(range: number) {
    if (range < 0 || range > 0xffff) {
      console.log('setRange failed, invalid range');
      return;
    }
    if (!this.device) {
      console.log('setRange failed, no device');
      return;
    }
    this.device.sendReport(
      0,
      new Uint8Array([
        0xf8,
        0x81,
        range & 0x00ff,
        (range & 0xff00) >> 8,
        0x00,
        0x00,
        0x00,
      ])
    );
    console.log('Wheel range set to ' + range);
  }

  activateForcefeedback() {
    if (!this.device) {
      console.log('activateForcefeedback failed, no device');
      return;
    }
    this.device.sendReport(
      0,
      new Uint8Array([0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    );
    console.log('Auto-Center enabled');
  }

  deactivateForcefeedback() {
    if (!this.device) {
      console.log('deactivateForcefeedback failed, no device');
      return;
    }
    this.device.sendReport(
      0,
      new Uint8Array([0xf5, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
    );
    console.log('Auto-Center disabled');
  }

  setForcefeedback(magnitude: number) {
    if (magnitude < 0.0 || magnitude > 1.0) {
      console.log('setForcefeedback failed, invalid magnitude');
      return;
    }
    if (!this.device) {
      console.log('setForcefeedback failed, no device');
      return;
    }
    if (magnitude == 0.0) {
      this.deactivateForcefeedback();
      return;
    }

    // Send default centering command.
    let value = magnitude * 0xffff;
    let expand_a, expand_b;
    if (value <= 0xaaaa) {
      expand_a = 0x0c * value;
      expand_b = 0x80 * value;
    } else {
      expand_a = 0x0c * 0xaaaa + 0x06 * (value - 0xaaaa);
      expand_b = 0x80 * 0xaaaa + 0xff * (value - 0xaaaa);
    }
    expand_a /= 0xaaaa;
    expand_b /= 0xaaaa;
    // 0xFE0D: custom auto-center
    // byte 3-4: effect strength, 0x00 to 0x0f
    // byte 5: rate the effect strength rises as the wheel turns, 0x00 to 0xff
    this.device.sendReport(
      0,
      new Uint8Array([0xfe, 0x0d, expand_a, expand_a, expand_b, 0x00, 0x00])
    );
    console.log('Auto-Center set to ' + magnitude);

    this.activateForcefeedback();
  }

  async disconnect() {
    if (this.device) {
      await this.device.close();
      console.log('G29 disconnected');
      this.connectedToWheel = false;
      this.readingData = false;
      this.device = null;
    }
  }
}
