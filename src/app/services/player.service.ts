import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class PlayerService {

  public playerList = new BehaviorSubject<string[]>([]);

  constructor() { }

  public addPlayer(player): void {
    const plList = this.playerList.value;
    plList.push(player);
    this.playerList.next(plList);
  }

  public removePlayer(player): void {
    const plList = this.playerList.value.filter((p) => p !== player);
    this.playerList.next(plList);
  }

  public players(): Observable<string[]> {
    return this.playerList.asObservable();
  }
}
