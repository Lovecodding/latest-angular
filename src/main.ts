import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { mergeApplicationConfig } from '@angular/core';

const browserConfig = mergeApplicationConfig(appConfig, {
  providers: [
    provideAnimations()
  ]
});

bootstrapApplication(AppComponent, browserConfig)
  .catch((err) => console.error(err));
