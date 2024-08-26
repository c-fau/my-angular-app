// src/webhid.d.ts

interface HIDDevice {
  opened: boolean;
  vendorId: number;
  productId: number;
  productName?: string;
  collections: HIDCollectionInfo[];
  oninputreport: (this: HIDDevice, ev: HIDInputReportEvent) => any;
  open(): Promise<void>;
  close(): Promise<void>;
  sendReport(reportId: number, data: BufferSource): Promise<void>;
  forget(): Promise<void>;
  addEventListener<K extends keyof HIDDeviceEventMap>(
    type: K,
    listener: (this: HIDDevice, ev: HIDDeviceEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof HIDDeviceEventMap>(
    type: K,
    listener: (this: HIDDevice, ev: HIDDeviceEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

interface HIDInputReportEvent extends Event {
  device: HIDDevice;
  reportId: number;
  data: DataView;
}

interface HIDDeviceEventMap {
  inputreport: HIDInputReportEvent;
}

interface HID extends EventTarget {
  getDevices(): Promise<HIDDevice[]>;
  requestDevice(options?: HIDDeviceRequestOptions): Promise<HIDDevice[]>;
  onconnect: (this: HID, ev: HIDConnectionEvent) => any;
  ondisconnect: (this: HID, ev: HIDConnectionEvent) => any;
  addEventListener<K extends keyof HIDEventMap>(
    type: K,
    listener: (this: HID, ev: HIDEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof HIDEventMap>(
    type: K,
    listener: (this: HID, ev: HIDEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
}

interface Navigator {
  hid: HID;
}

interface HIDDeviceRequestOptions {
  filters: HIDDeviceFilter[];
}

interface HIDDeviceFilter {
  vendorId?: number;
  productId?: number;
  usagePage?: number;
  usage?: number;
}

interface HIDConnectionEvent extends Event {
  device: HIDDevice;
}

interface HIDCollectionInfo {
  usagePage: number;
  usage: number;
  reportIds: number[];
  children: HIDCollectionInfo[];
}

interface HIDEventMap {
  connect: HIDConnectionEvent;
  disconnect: HIDConnectionEvent;
}
