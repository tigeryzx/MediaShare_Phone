import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError, finalize } from 'rxjs/operators';
import { mergeMap } from 'rxjs/operators';
import { LoadingController, Loading, AlertController, NavController, App } from 'ionic-angular';
import { LocalStorgeProvider } from '../providers/local-storge/local-storage';
import { USER_INFO } from '../providers/local-storge/local-storage.namespace';
import { UserInfo } from '../domain/entity';
import { LoginPage } from '../pages/login/login';
import { DateHelper } from '../util/date-helper';
import { USER_LOGIN } from '../providers/api';
import { ConfigProvider } from '../providers/config/config';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    private loader: Loading;

    constructor(
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private localstorage: LocalStorgeProvider,
        private dateHelper: DateHelper,
        public appCtrl: App,
        private configProvider: ConfigProvider) {

    }

    showLoading(method: string): void {
        if (method.toUpperCase() != 'OPTIONS' && this.loader == null) {
            this.loader = this.loadingCtrl.create({
                content: "请稍候..."
            });
            this.loader.present();
            console.log('show on ' + method);
        }
    }


    hideLoading(method: string): void {
        if (method.toUpperCase() != 'OPTIONS' && this.loader) {
            this.loader.dismiss();
            console.log('hide on ' + method);
            this.loader = null;
        }
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {

        var newUrl = req.url;
        if (req.url.indexOf('[API_ROOT]') != -1)
            newUrl = newUrl.replace('[API_ROOT]', this.configProvider.getAppConfig().apiRoot);

        let authReq: HttpRequest<any> = req.clone({
            url: newUrl
        });

        const userInfo = this.localstorage.get<UserInfo>(USER_INFO);
        if (userInfo && userInfo.accessToken && !this.dateHelper.isExpireDate(userInfo.expireDate)) {
            authReq = authReq.clone({
                setHeaders: { Authorization: 'Bearer ' + userInfo.accessToken }
            });
        } else if(userInfo && userInfo.accessToken && this.dateHelper.isExpireDate(userInfo.expireDate)) {
            if (req.url.toUpperCase().indexOf(USER_LOGIN.toUpperCase()) == -1) {
                let activeNav: NavController = this.appCtrl.getActiveNav();
                activeNav.push(LoginPage, {
                    loginType: 'relogin'
                });
            }
        }

        this.showLoading(req.method);

        return next.handle(authReq).pipe(
            mergeMap((event: any) => {

                if (event instanceof HttpResponse) {
                    this.hideLoading(authReq.method);
                    if (event.status != 200)
                        return ErrorObservable.create(event);
                }
                return Observable.create(observer => {
                    observer.next(event);
                }); //请求成功返回响应
            }),
            catchError((res: HttpErrorResponse) => {   //请求失败处理
                this.hideLoading(authReq.method);
                let msg = '请求失败';
                switch (res.status) {
                    case 0: {
                        msg = '请求服务器失败，请稍候重试';
                        break;
                    }
                    case 401:
                        break;
                    case 200: {
                        break;
                    }
                    case 404:
                        break;
                    case 403:
                        console.log('业务错误');
                        break;
                    case 500: {
                        msg = '系统错误';
                        if (res.error && res.error.error)
                            msg = `${res.error.error.message}:${res.error.error.details}`;
                        break;
                    }
                }

                this.alertCtrl.create({
                    title: '错误',
                    message: msg,
                    buttons: ['好的']
                }).present();

                return ErrorObservable.create(event);
            }),
            finalize(() => {
                this.hideLoading(req.method);
            }));
    }
}