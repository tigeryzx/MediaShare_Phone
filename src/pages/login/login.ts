import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { LoginInfo } from '../../domain/entity';
import { UserProvider } from '../../providers/user/user';
import { LocalStorgeProvider } from '../../providers/local-storge/local-storage';
import { USER_INFO } from '../../providers/local-storge/local-storage.namespace';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {

    loginInfo: LoginInfo = new LoginInfo();

    constructor(
        private userProvider: UserProvider,
        public navCtrl: NavController,
        public navParams: NavParams,
        private localStorage: LocalStorgeProvider) {

    }

    ionViewDidLoad() {
        const userInfo = this.localStorage.get(USER_INFO);
        if (userInfo != null) {
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
        this.navCtrl.setPages([{ page: HomePage }]);
    }

}
