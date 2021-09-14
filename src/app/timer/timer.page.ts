import { Component } from "@angular/core";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { ModalController } from "@ionic/angular";
import { FormatTimePipe } from "../pipe/formatTimepipe";
import { SettingsPage } from "../settings/settings.page";
import { InterfacePlayer } from "../types/player";

@Component({
  selector: "app-home",
  templateUrl: "timer.page.html",
  styleUrls: ["timer.page.scss"],
})
export class TimerPage {

  constructor(
    private nativeStorage: NativeStorage,
    public modalController: ModalController,
    private timePipe: FormatTimePipe,
  ) { }

  public amount = 2;
  public player: InterfacePlayer[] = [];
  public time = 0;
  private interval;
  public running = false;
  public current = 0;
  public showTime: string;

  public async openSettings() {
    const modal = await this.modalController.create({
      component: SettingsPage,
      backdropDismiss: false,
    });
    modal.onDidDismiss().then(() => {
      this.nativeStorage.getItem("settings").then((res) => {
        this.amount = res.player ? res.player : 2;
        this.time = res.time ? res.time : 120;
        this.reset();
      });
    });
    return await modal.present();
  }

  public ionViewWillEnter() {
    this.nativeStorage.getItem("settings").then((res) => {
      this.amount = res.player ? res.player : 2;
      this.time = res.time ? res.time : 120;
    }).catch(() => {
      this.nativeStorage.setItem("settings", {
        player: 2,
        time: 120
      });
    }).then(() => {
      for (let x = 0; x < this.amount; x++) {
        this.player[x] = { time: this.time, close: false, turn: false };
      }
      this.player[this.current].turn = true;
      this.transformTime();
    });
  }

  public reset() {
    this.pauseTimer();
    for (let x = 0; x < this.amount; x++) {
      this.player[x].time = this.time;
      this.player[x].close = false;
    }
    this.player[0].turn = true;
    this.transformTime();
  }

  public startGame() {
    if (this.running) {
      this.nextTimer();
    } else {
      this.startTimer();
    }
  }

  public startTimer() {
    this.running = true;
    const currentPlayer = this.player[this.current];
    if (currentPlayer.time <= 60) {
      this.interval = setInterval(() => {
        currentPlayer.time = Math.round((currentPlayer.time - 0.1) * 10) / 10;
        if (currentPlayer.time === 0) {
          this.running = false;
          this.player[this.current].turn = false;
          this.pauseTimer();
          this.showTime = "Game over";
          console.log(this.showTime);
          setTimeout(() => {
            this.player.forEach((player) => {
              player.close = false;
              player.time = this.time;
              player.turn = false;
            });
            this.current = 0;
            this.player[this.current].turn = true;
            this.transformTime();
          }, 1500);
        } else if (currentPlayer.time <= 30
            && !currentPlayer.close) {
          currentPlayer.close = true;
        }
        this.transformTime();
      }, 100);
    } else {
      this.interval = setInterval(() => {
        if (currentPlayer.time <= 62) {
          clearInterval(this.interval);
          this.startTimer();
        }
        currentPlayer.time -= 1;
        this.transformTime();
      }, 1000);
    }
  }

  public pauseTimer() {
    clearInterval(this.interval);
  }

  private nextTimer() {
    let current = this.current;
    const currentPlayer = this.player[current];
    this.pauseTimer();
    currentPlayer.turn = false;
    if (current + 1 === this.amount) {
      current = 0;
    } else {
      current += 1;
    }
    this.current = current;
    currentPlayer.turn = true;
    this.transformTime();
    this.startTimer();
  }

  private transformTime() {
    this.showTime = this.timePipe.transform(this.player[this.current].time);
  }
}
