import { Component } from "@angular/core";
import { DateRange } from "./app.module";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  range: DateRange;
  limit: DateRange;

  constructor() {
    const today = new Date();

    // задаем начальные временные рамки
    this.limit = {
      start: new Date(today.getFullYear(), today.getMonth(), 1),
      end: new Date()
    };
    // обнуляем выбраный период
    this.range = { start: null, end: null };
  }

  setRange(dates: Array<Date>) {
    this.range = { start: dates[0], end: dates[1] };
  }
}
