import { bootstrapApplication } from '@angular/platform-browser';
import { config } from './src/app/app.config.server';
import { AppComponent } from './src/app/app.component';

const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;
