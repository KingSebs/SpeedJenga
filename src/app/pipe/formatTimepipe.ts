import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "formatTime" })
export class FormatTimePipe implements PipeTransform {
    transform(time: number): string {
        let showTime;
        const min = Math.floor(time / 60);
        const sec = time - min * 60;
        if (min > 0 && min.toString().length < 2 && sec > 9) {
            showTime = "0" + min + ":" + sec;
        } else if (sec < 10 && min > 9) {
            showTime = min + ":" + "0" + sec;
        } else if (sec < 10 && min < 10 && min > 0 ) {
            showTime = "0" + min + ":" + "0" + sec;
        } else if (min < 1 && sec < 10) {
            showTime = "0" + time.toFixed(1);
        } else if (min < 1) {
            showTime = time.toFixed(1);
        } else {
            showTime = min + ":" + sec;
        }
        return showTime;
    }
}
