import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginInfo, UserInfo } from '../../domain/entity';
import { UserProvider } from '../../providers/user/user';
import { LocalStorgeProvider } from '../../providers/local-storge/local-storage';
import { USER_INFO } from '../../providers/local-storge/local-storage.namespace';
import { DateHelper } from '../../util/date-helper';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    loginInfo: LoginInfo = new LoginInfo();
    loginType: string = null;

    constructor(
        private userProvider: UserProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        private localStorage: LocalStorgeProvider,
        private toastCtrl: ToastController,
        private dateHelper: DateHelper
    ) {
        this.loginType = navParams.get('loginType');
        if (this.loginType == 'relogin') {
            const toast = this.toastCtrl.create({
                message: '登录过期，请重新登录',
                duration: 4000,
                position: 'top'
            });
            toast.present();
        }
    }

    ionViewDidLoad() {
        const userInfo = this.localStorage.get<UserInfo>(USER_INFO);

        if (userInfo != null && !this.dateHelper.isExpireDate(userInfo.expireDate)) {
            this.gotoHomePage();
        }
    }

    login(): void {
        if (this.loginInfo.userNameOrEmailAddress && this.loginInfo.password) {
            this.userProvider.login(this.loginInfo).subscribe(userInfo => {
                this.localStorage.set(USER_INFO, userInfo);
                this.gotoHomePage();
            });
        }
    }

    gotoHomePage(): void {
        if (this.loginType == null) {
            this.navCtrl.setPages([{ page: HomePage }]);
        } else {
            this.navCtrl.pop();
        }

    }

}
