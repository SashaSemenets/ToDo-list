import { Component } from '@angular/core';
import { formatDate } from '@angular/common';
import { dateFormat, dayOfWeekFormat, locale, monthFormat, yearFormat } from '@models/date-format';

@Component({
  selector: 'app-date-info',
  templateUrl: './date-info.component.html',
  styleUrls: ['./date-info.component.scss']
})
export class DateInfoComponent {
  private _today: Date = new Date();

  public get today() {
    return this._today;
  }

  public get date() {
    return formatDate(this.today, dateFormat, locale);
  }

  public get month() {
    return formatDate(this.today, monthFormat, locale);
  }

  public get year() {
    return formatDate(this.today, yearFormat, locale);
  }

  public get dayOfWeek() {
    return formatDate(this.today, dayOfWeekFormat, locale);
  }
}
