import { Injectable } from "@angular/core";

@Injectable()
export class DateHelper {
    isExpireDate(date: Date): boolean {
        return new Date() > date;
    }
}