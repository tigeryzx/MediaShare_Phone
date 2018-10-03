import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SYS_SHUTDOWN_SERVER, SYS_CANCEL_SHUTDOWN, SYS_GET_SHUTDOWN_DATE } from '../api';
import { Subject } from 'rxjs/Subject';
import { PowerOffState, ApiResult } from '../../domain/entity';
import { map } from 'rxjs/operators';
import { App, ToastController } from 'ionic-angular';
import { InfoPage } from '../../pages/info/info';

/*
  Generated class for the SysProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SysProvider {

  public powerState$: Subject<PowerOffState> = new Subject<PowerOffState>();

  private state: PowerOffState = null;
  private intervalId = null;

  constructor(
    private http: HttpClient,
    private appCtrl: App,
    private toastCtrl: ToastController) {
    console.log('Hello SysProvider Provider');
  }

  private createShutdownInfo(powerOfDate: Date): void {
    if (this.state == null) {
      this.state = new PowerOffState();
      this.state.powerOffDate = powerOfDate;
      this.intervalId = setInterval(() => {
        if (this.state) {
          let s = this.getShutdownSecond(this.state.powerOffDate);
          console.log(s);
          if (s == 30) {
            const toast = this.toastCtrl.create({
              message: '系统将于30秒后关闭',
              duration: 3000,
              position: 'top'
            });
            toast.present();
          }
          if (s == 5) {
            this.appCtrl.getRootNav().setRoot(InfoPage, {
              msg: '系统已关闭，欢迎下次使用!'
            });
          }
          if (s < 0) {
            clearInterval(this.intervalId);
            this.intervalId = null;
          }
          this.state.msg = this.getTimeMsg(s);
          this.powerState$.next(this.state);
        }
      }, 1000);
    }
  }

  checkShutdownInfo(): void {
    this.http.get<ApiResult<Date>>(SYS_GET_SHUTDOWN_DATE)
      .pipe(
        map(x => x.result)
      )
      .subscribe(shutdownDate => {
        if (shutdownDate != null)
          this.createShutdownInfo(new Date(shutdownDate));
      });
  }

  shutdownServer(second: number): void {
    if (this.state == null) {
      this.http.post<any>(SYS_SHUTDOWN_SERVER + `?second=${second}`, null)
        .subscribe(x => {
          let powerOfDate = new Date();
          powerOfDate.setSeconds(powerOfDate.getSeconds() + second);
          this.createShutdownInfo(powerOfDate);
        });
    }
  }

  cancelShutdown(): void {
    if (this.state != null) {
      this.http.post<any>(SYS_CANCEL_SHUTDOWN, null)
        .subscribe(x => {
          this.state = null;
          clearInterval(this.intervalId);
          this.intervalId = null;
          this.powerState$.next(null);
        });
    }
  }

  private getShutdownSecond(date: Date): number {
    if (typeof (date) == 'string') {
      date = new Date(date);
    }
    return Math.round((date.getTime() - new Date().getTime()) / 1000);
  }

  private getTimeMsg(s: number): string {
    if (s <= 0)
      return '即将关机';
    return `约在${Math.floor(s / 60)}分${Math.floor(s % 60)}秒后关机`;
  }
}
