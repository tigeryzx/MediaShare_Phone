import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SYS_SHUTDOWN_SERVER } from '../api';
import { Observable } from 'rxjs/Observable';

/*
  Generated class for the SysProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SysProvider {

  constructor(private http: HttpClient) {
    console.log('Hello SysProvider Provider');
  }

  shutdownServer(second: number): Observable<any> {
    return this.http.post<any>(SYS_SHUTDOWN_SERVER + `?second=${second}`, null);
  }
}
