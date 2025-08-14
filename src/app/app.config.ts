import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideMomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { routes } from './app.routes';

const SUPPORTED_INPUT_FORMATS = [
  'DD.MM.YYYY',  // 01.10.2000
  'D.M.YYYY',    // 1.10.2000 (if you want to allow single digits)
  'YYYY.MM.DD',  // 2000.10.01
  'YYYY-MM-DD',  // 2000-10-01 (optional, nice to support)
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    { provide: MAT_DATE_LOCALE, useValue: 'de-CH' },
    provideMomentDateAdapter(MAT_MOMENT_DATE_FORMATS, { strict: true }),
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        ...MAT_MOMENT_DATE_FORMATS,
        // Accept several input formats…
        parse:   { dateInput: SUPPORTED_INPUT_FORMATS },
        // …but always DISPLAY as DD.MM.YYYY
        display: { ...MAT_MOMENT_DATE_FORMATS.display, dateInput: 'DD.MM.YYYY' },
      },
    },
  ],
};
