import {Injectable} from '@angular/core';
import {LoadingService} from './loading.service';
import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NotifierService} from 'angular-notifier';
import {AuthService} from '../auth-controller/guard/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService {

  private notifier: NotifierService;

  constructor(notifierService: NotifierService, private loadingService: LoadingService, private authService: AuthService) {
    this.notifier = notifierService;
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.showLoading();
    return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          window.scroll(0, 0);
          this.hideLoading();
          if (event.body.status === 'Ok') {
            if (event.body.msg) {
              this.notifier.notify('success', event.body.msg);
            }
          } else if (event.body.status === 'Error') {
            if (event.body.msg) {
              this.notifier.notify('error', event.body.msg);
            }
          }
        }
      },
      (err: any) => {
        if (err.status === 401) {
          this.authService.onClear();
        }
        if (err.error.msg) {
          this.notifier.notify('error', err.error.msg);
        } else if (err.message) {
          // this.notifier.notify('error', err.message);
        }
        this.hideLoading();
      }));
  }


  hideLoading() {
    this.loadingService.hide();
  }

  showLoading() {
    this.loadingService.show();
  }

}
