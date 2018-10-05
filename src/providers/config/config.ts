import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENV } from '@app/env';
import { AppConfig } from 'domain/entity';
import { AlertController } from 'ionic-angular';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

/*
  Generated class for the ConfigProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ConfigProvider {

  private appConfig: AppConfig = null;

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController) {
    console.log('Hello ConfigProvider Provider');
  }

  loadAppConfig(): Observable<AppConfig> {
    let configUrl = '/assets/config/' + ENV.configFile;
    return this.http.get<AppConfig>(configUrl)
    .pipe(
      tap(result =>this.appConfig = result)
    );
  }

  getAppConfig(): AppConfig {
    if (this.appConfig == null) {
      this.alertCtrl.create({
        title: '错误',
        message: '获取配置文件出错，程序将不能正常运行。',
        buttons: ['好的']
      }).present();
    }
    return this.appConfig;
  }
}
