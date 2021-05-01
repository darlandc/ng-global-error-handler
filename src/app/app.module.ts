import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import * as Sentry from '@sentry/angular';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpIntercept } from './services/http-interceptor';
import { Integrations } from '@sentry/tracing';
import { TestService } from './services/test.service';
Sentry.init({
  dsn: 'https://818f3f36b55349c6bd46410cdac2ab2e@o601891.ingest.sentry.io/5744309',
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: ['localhost', 'https://yourserver.io/api'],
      routingInstrumentation: Sentry.routingInstrumentation,
    }),
  ],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

// setup custom config to capture details about user
Sentry.configureScope((scope) => {
  scope.setUser({email : 'darlandc@gmail.com'});
});

@Injectable()
// pass angular inbuilt errorhandler to sentry
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error: any): any {
    Sentry.captureException(error.originalError || error);
    throw error;
  }
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    BrowserTransferStateModule,
    HttpClientModule,
  ],
  // pass angular inbuilt errorhandler to sentry
  providers: [
    TestService,
    // { provide: ErrorHandler, useClass: SentryErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true},
      {
        provide: ErrorHandler,
        useValue: Sentry.createErrorHandler({
          showDialog: true,
        }),
      },
      // {
      //   provide: Sentry.TraceService,
      //   deps: [Router],
      // },
      // {
      //   provide: APP_INITIALIZER,
      //   useFactory: () => () => {},
      //   deps: [Sentry.TraceService],
      //   multi: true,
      // },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
