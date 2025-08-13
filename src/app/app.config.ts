import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideMomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),

    // locale
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },

    // use Moment instead of the native adapter
    provideMomentDateAdapter(MAT_MOMENT_DATE_FORMATS, { strict: true }),

    // force DD.MM.YYYY for display AND for parsing typed input
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        ...MAT_MOMENT_DATE_FORMATS,
        parse:   { dateInput: 'DD.MM.YYYY' },
        display: { ...MAT_MOMENT_DATE_FORMATS.display, dateInput: 'DD.MM.YYYY' },
      },
    },
  ],
};
