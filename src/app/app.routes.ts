import { Routes } from '@angular/router';
import { TestComponent } from './test/test.component';
import { KeyControlsComponent } from './key-controls/key-controls.component';

export const routes: Routes = [
    { path: 'test', component: TestComponent },
    { path: 'key-controls', component: KeyControlsComponent },

];
