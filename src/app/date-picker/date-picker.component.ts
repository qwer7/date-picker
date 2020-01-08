import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  ChangeDetectionStrategy
} from "@angular/core";
import * as moment from "moment";

interface Day {
  day: moment.Moment;
  current: boolean; // текущий ли это месяц
  active: boolean; // доступны ли эти даты для выбора
  select: boolean; // выбранный диапазон
}

@Component({
  selector: "date-picker",
  templateUrl: "./date-picker.component.html",
  styleUrls: ["./date-picker.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatePickerComponent implements OnInit, OnChanges {
  @Input() limitFrom: Date;
  @Input() limitTo: Date;
  @Input() locale: string;

  protected dateFrom: Date;
  protected dateTo: Date;

  @Output() setDate: EventEmitter<Array<Date>> = new EventEmitter<
    Array<Date>
  >();

  current: moment.Moment;
  month: Day[][];
  error: boolean;

  constructor() {}

  /**
   * Инициализация компонента, проверка параметров
   */
  ngOnChanges() {
    // проверка параметров
    this.error = true;
    if (this.locale) moment.locale(this.locale);
    if (!this.limitFrom && !this.limitTo) {
      throw new Error("Attribute limitFrom or limitTo required");
    }

    // заполнение данных
    this.current = this.current || moment();
    this.dateFrom = this.dateTo = null;
    this.setDate.emit([null, null]);
    this.fillCalendar();
    this.error = false;
  }

  ngOnInit() {}

  /**
   * Сдвигает дату на заданное количество месяцев
   * @param shift смещение в количестве месяцев, отрицательное смещает назад
   */
  moveMonth(shift: number) {
    const moveTo = shift > 0 ? moment().add : moment().subtract;
    this.current = moveTo.call(this.current.clone(), Math.abs(shift), "month");
    this.fillCalendar();
  }

  /**
   * Заполняет объект описывающий текущий день отображаемого месяца
   */
  fillDay(now: moment.Moment): Day {
    return {
      day: now,
      current: now.isSame(this.current, "month"),
      active:
        (!this.limitFrom || now.isSameOrAfter(this.limitFrom, "day")) &&
        (!this.limitTo || now.isSameOrBefore(this.limitTo, "day")),
      select: now.isBetween(
        this.dateFrom || null,
        this.dateTo || this.dateFrom,
        "day",
        "[]"
      )
    };
  }

  /**
   * Заполняет календарь днями отображаемыми в текущем месяце
   */
  fillCalendar(): void {
    const start = this.current
      .clone()
      .startOf("month")
      .startOf("week");

    let weeks = [...Array(6).keys()] // Максимум может быть 6 недель
      .map(w => {
        return [...Array(7).keys()] // 7 дней в неделе (c) капитан Очевидность
          .map(d => {
            const now = start.clone();
            now.add(w, "week").add(d, "day");
            return this.fillDay(now);
          });
      })
      .filter(w => w[0].current || w[6].current); // есть хоть один день недели в текущем месяце

    this.month = weeks;
  }

  /**
   * Действие при выборе заданной даты (выделение дат если это возможно)
   * Возвращение результата родительскому компоненту в виде массива из двух элементов
   * @param select выбранный объект типа Day
   */
  choiceDay(select: Day): void {
    const day = select.day;

    if (!select.active) return;

    if (this.dateFrom && !this.dateTo) {
      this.dateTo = moment.max(day, moment(this.dateFrom)).toDate();
      this.dateFrom = moment.min(day, moment(this.dateFrom)).toDate();
    } else {
      this.dateFrom = day.toDate();
      this.dateTo = null;
    }

    this.setDate.emit([this.dateFrom, this.dateTo]);
    this.fillCalendar();
  }
}
