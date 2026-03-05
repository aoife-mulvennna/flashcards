import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ApiService } from './app/core/services/api';

bootstrapApplication(App, appConfig)
  .then(appRef => {
    try {
      const injector = appRef.injector;
      const api = injector.get(ApiService);
      // warm the decks list so data begins loading immediately on refresh
      api.getDecks().subscribe({ next: () => {}, error: () => {} });
    } catch (e) {
      // ignore if lookup fails
    }
  })
  .catch((err) => console.error(err));
