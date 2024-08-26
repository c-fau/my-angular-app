import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { KeyControlsComponent } from './key-controls/key-controls.component';
import { WheelControlComponent } from './wheel-control/wheel-control.component';
import { CamFeedComponent } from './cam-feed/cam-feed.component';

export const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'key-controls', component: KeyControlsComponent },
  { path: 'wheel-control', component: WheelControlComponent },
  { path: 'cam-feed', component: CamFeedComponent },
];
