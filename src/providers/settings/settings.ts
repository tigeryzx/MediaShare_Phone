import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';
import { LocalStorgeProvider } from '../local-storge/local-storage';
import { SETTING_THEME } from '../local-storge/local-storage.namespace';

/*
  Generated class for the SettingsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SettingsProvider {
  public theme$: Subject<string> = new Subject<string>();

  public LIGHT_THEME_NAME: string = 'light-theme';
  public DARK_THEME_NAME: string = 'dark-theme';
  private currentTheme: string = null;

  constructor(
    private localStorge: LocalStorgeProvider
  ) {
    var settingTheme = this.localStorge.getString(SETTING_THEME);
    if (settingTheme)
      this.currentTheme = settingTheme;
    else
      this.currentTheme = this.LIGHT_THEME_NAME;
  }

  switchTheme(): void {
    if (this.currentTheme == this.LIGHT_THEME_NAME)
      this.setTheme(this.DARK_THEME_NAME);
    else
      this.setTheme(this.LIGHT_THEME_NAME);
  }

  setTheme(theme: string): void {
    this.currentTheme = theme;
    this.theme$.next(this.currentTheme);
    this.localStorge.setString(SETTING_THEME, this.currentTheme);
  }

  getTheme(): string {
    return this.currentTheme;
  }
}
