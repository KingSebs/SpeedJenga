import { Component } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { ModalController, PickerController } from "@ionic/angular";

@Component({
  selector: "app-settings",
  templateUrl: "settings.page.html",
  styleUrls: ["settings.page.scss"],
})
export class SettingsPage {

  constructor(
    private nativeStorage: NativeStorage,
    public modalController: ModalController,
    private pickerController: PickerController
  ) { }

  public amount = 0;
  public time = 0;
  public minutes = 0;
  public seconds = 0;
  public showseconds = "00";
  public amountOptions = [[
    2, 3, 4, 5, 6, 7, 8, 9, 10
  ]];
  public values = this.getMinutes();

  public getMinutes() {
    const minutes = [[]];
    for (let i = 0; i < 60; i++) {
      minutes[0].push(i + 1);
    }
    return minutes;
  }

  public formatseconds(seconds: number) {
    if (seconds < 10) {
      this.showseconds = "0" + seconds.toString();
    } else {
      this.showseconds = seconds.toString();
    }
  }

  public ionViewWillEnter() {
    this.nativeStorage.getItem("settings").then((res) => {
      this.amount = res.player;
      this.time = Math.abs(res.time);
    }).then(() => {
      this.minutes = Math.floor(this.time / 60);
      this.seconds = this.time - (this.minutes * 60);
      this.formatseconds(this.seconds);
    });
  }

  public save() {
    this.nativeStorage.setItem("settings", {
      player: this.amount,
      time: this.time
    });
    this.minutes = Math.floor(this.time / 60);
    this.seconds = this.time - (this.minutes * 60);
    this.formatseconds(this.seconds);
  }

  public close() {
    this.modalController.dismiss();
  }

  public async openAmountPicker() {
    const picker = await this.pickerController.create({
      columns: this.getColumnsAmount(this.amountOptions[0].length),
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Confirm",
          handler: (value) => {
            this.amount = value.amount.value;
            this.save();
          }
        }
      ]
    });
    picker.columns[0].selectedIndex = this.amount - 2;
    picker.columns[0].options[0].selected = false;
    picker.columns[0].options[this.amount - 2].selected = true;
    await picker.present();
  }

  public getColumnsAmount(numOptions) {
    const columns = [];
    columns.push({
      name: `amount`,
      options: this.getColumnOptionsAmount(numOptions),
    });
    console.log(columns);
    columns[0].options[this.amount - 2].selected = true;
    console.log(columns[0].options);
    return columns;
  }

  public getColumnOptionsAmount(numOptions) {
    const options = [];
    for (let i = 0; i < numOptions; i++) {
      options.push({
        text: (i + 2) + " Players",
        value: this.amountOptions[0][i],
        selected: false
      });
    }
    return options;
  }

  public async openTimePicker() {
    const picker = await this.pickerController.create({
      columns: this.getColumnsTime(this.values[0].length),
      buttons: [
        {
          text: "Cancel",
          role: "cancel"
        },
        {
          text: "Confirm",
          handler: (value) => {
            this.time = (value.minutes.value * 60) + value.seconds.value;
            this.save();
          }
        }
      ]
    });
    picker.columns[0].selectedIndex = this.minutes - 1;
    if (this.seconds === 0) {
      picker.columns[1].selectedIndex = 0;
    } else if (this.seconds === 15) {
      picker.columns[1].selectedIndex = 1;
    } else if (this.seconds === 30) {
      picker.columns[1].selectedIndex = 2;
    } else if (this.seconds === 45) {
      picker.columns[1].selectedIndex = 3;
    }
    await picker.present();
  }

  public getColumnsTime(numOptions) {
    const columns = [];
    columns.push({
      name: `minutes`,
      options: this.getColumnOptionsTime(numOptions)
    });
    columns.push({
      name: "seconds",
      options: [
        { text: "0 seconds", value: 0, selected: false },
        { text: "15 seconds", value: 15, selected: false },
        { text: "30 seconds", value: 30, selected: false },
        { text: "45 seconds", value: 45, selected: false },
      ],
    });
    if (this.seconds === 0) {
      columns[1].options[0].selected = true;
    } else if (this.seconds === 15) {
      columns[1].options[1].selected = true;
    } else if (this.seconds === 30) {
      columns[1].options[2].selected = true;
    } else if (this.seconds === 45) {
      columns[1].options[3].selected = true;
    }
    return columns;
  }

  public getColumnOptionsTime(numOptions) {
    const options = [];
    for (let i = 0; i < numOptions; i++) {
      if (i === 0) {
        if (this.minutes === 1) {
          options.push({
            text: (i + 1) + " minute",
            value: this.values[0][i],
            selected: true
          });
        } else {
          options.push({
            text: (i + 1) + " minute",
            value: this.values[0][i],
          });
        }
      } else {
        if (this.minutes === i + 1) {
          options.push({
            text: (i + 1) + " minutes",
            value: this.values[0][i],
            selected: true,
          });
        } else {
          options.push({
            text: (i + 1) + " minutes",
            value: this.values[0][i],
          });
        }
      }
    }
    return options;
  }

  public setDarkmode(event) {
    if (event.detail.checked) {
      document.body.setAttribute("data-theme", "dark");
    }
    else {
      document.body.setAttribute("data-theme", "light");
    }
  }
}
