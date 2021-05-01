import { genericRetryStrategy } from './utils/retry';
import {
  Component,
  Injector,
  OnInit,
  Inject,
  PLATFORM_ID,
  Renderer2,
  ViewChild
} from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/platform-browser';
const configKey = makeStateKey('CONFIG');
import { TestService } from './services/test.service';
import * as Sentry from '@sentry/browser';
import { retryWhen } from 'rxjs/internal/operators/retryWhen';
import { of } from 'rxjs/internal/observable/of';
import { catchError } from 'rxjs/operators';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public title: string;
  public errorText: string;
  public errBlock: boolean;

  constructor(public srv: TestService) {}

  ngOnInit(): void {
    this.srv
      .getData()
      .subscribe(
        res => console.log(res),
        err => {
          this.errBlock = true;
          this.errorText = err.message;
        }
      );
  }
}
