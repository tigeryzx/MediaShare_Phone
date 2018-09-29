import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class HttpHelper {
    objectConvertToHttpParams(obj: object): HttpParams {
        if (obj) {
            let params = new HttpParams();
            for (const key in obj) {
                if (obj[key] != null && obj[key] != undefined) {
                    params = params.set(key, obj[key]);
                }
            }
            return params;
        }
        return null;
    }
}