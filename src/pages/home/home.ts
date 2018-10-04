import { Component, OnDestroy } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { VideoListPage } from '../video-list/video-list';
import { FavListPage } from '../fav-list/fav-list';
import { LocalStorgeProvider } from '../../providers/local-storge/local-storage';
import { LuckVideoRequest } from '../../domain/entity';
import { VideoProvider } from '../../providers/video/video';
import { VideoInfoPage } from '../video-info/video-info';
import { SysProvider } from '../../providers/sys/sys';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { SettingsProvider } from '../../providers/settings/settings';
import { UserProvider } from '../../providers/user/user';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnDestroy {

  powerOffTip: string = '定时关机';
  powerOffTimeTip: string = '';
  isWaitPowerOff: boolean = false;
  
  private destory$ = new Subject();

  constructor(
    public localStorage: LocalStorgeProvider,
    private videoProvider: VideoProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private sysProvider: SysProvider,
    private settingsProvider: SettingsProvider,
    private userProvider:UserProvider) {
  }

  ngOnDestroy(): void {
    this.destory$.next();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.sysProvider.powerState$
      .pipe(takeUntil(this.destory$))
      .subscribe(x => {
        if (x != null) {
          this.powerOffTimeTip = x.msg;
          // 因为会每秒调用，防止重复设置
          if (this.isWaitPowerOff != true) {
            this.isWaitPowerOff = true;
            this.powerOffTip = '撤消关机';
          }
        } else {
          this.isWaitPowerOff = false;
          this.powerOffTip = '定时关机';
          this.powerOffTimeTip = '';
        }
      });
    this.sysProvider.checkShutdownInfo();
  }

  powerOff(): void {
    if (this.isWaitPowerOff) {
      this.cancelPowerOff();
    } else {
      this.doPowerOff();
    }
  }

  private cancelPowerOff(): void {
    this.sysProvider.cancelShutdown();
  }

  private doPowerOff(): void {
    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '多少久后关闭系统(分)?',
      inputs: [
        {
          name: 'minute',
          placeholder: '请输入分钟数',
          value: '1'
        }
      ],
      buttons: [
        {
          text: '取消',
          handler: () => {

          }
        },
        {
          text: '确认',
          handler: (data) => {
            let second = parseInt(data.minute) * 60;
            this.sysProvider.shutdownServer(second);
          }
        }
      ]
    });
    confirm.present();
  }

  longout(): void {

    const confirm = this.alertCtrl.create({
      title: '提示',
      message: '是否确认退出?',
      buttons: [
        {
          text: '取消',
          handler: () => {

          }
        },
        {
          text: '注销',
          handler: () => {
            this.userProvider.logout();
            this.navCtrl.setPages([{
              page: LoginPage
            }]);
          }
        }
      ]
    });
    confirm.present();
  }

  videoList(): void {
    this.openVideoList(null);
  }

  videoListByHot(): void {
    this.openVideoList('hot');
  }

  videoListByLast(): void {
    this.openVideoList('last');
  }

  videoListByHistory(): void {
    this.openVideoList('history');
  }

  videoListByRandom(): void {
    this.openVideoList('random');
  }
  private openVideoList(loadType: string): void {
    this.navCtrl.push(VideoListPage, {
      type: loadType
    });
  }

  favList(): void {
    this.navCtrl.push(FavListPage);
  }

  switchTheme(): void {
    this.settingsProvider.switchTheme();
  }

  getLuckVideo(): void {
    let luckParam = new LuckVideoRequest();
    luckParam.inAllVideo = true;
    this.videoProvider.getLuckVideo(luckParam)
      .subscribe(video => {
        this.videoProvider.setCurrentVideo(video);
        this.navCtrl.push(VideoInfoPage);
      });
  }
}
