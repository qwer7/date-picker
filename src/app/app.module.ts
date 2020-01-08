import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { DatePickerComponent } from "./date-picker/date-picker.component";
import { MomentPipe } from "./date-picker/moment.pipe";

export interface DateRange {
  start: Date;
  end: Date;
}

@NgModule({
  declarations: [AppComponent, DatePickerComponent, MomentPipe],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
