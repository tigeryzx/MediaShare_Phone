import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { VideoInfoPage } from '../pages/video-info/video-info';
import { VideoListPage } from '../pages/video-list/video-list';
import { FavListPage } from '../pages/fav-list/fav-list';
import { FavInfoPage } from '../pages/fav-info/fav-info';
import { VideoProvider } from '../providers/video/video';
import { UserProvider } from '../providers/user/user';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { InterceptorService } from '../interceptor/http-interceptor-service';
import { LocalStorgeProvider } from '../providers/local-storge/local-storage';
import { HttpHelper } from '../util/http-helper';
import { FavProvider } from '../providers/fav/fav';
import { ComponentsModule } from '../components/components.module';
import { DateHelper } from '../util/date-helper';
import { SysProvider } from '../providers/sys/sys';
import { InfoPage } from '../pages/info/info';
import { SettingsProvider } from '../providers/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    VideoListPage,
    VideoInfoPage,
    FavListPage,
    FavInfoPage,
    InfoPage
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ComponentsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: "返回"
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    VideoListPage,
    VideoInfoPage,
    FavListPage,
    FavInfoPage,
    InfoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClient,
    // { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    VideoProvider,
    UserProvider,
    LocalStorgeProvider,
    HttpHelper,
    FavProvider,
    DateHelper,
    SysProvider,
    SettingsProvider
  ]
})
export class AppModule { }
