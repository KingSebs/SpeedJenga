import { Component, Inject, Injectable, Input, OnInit } from "@angular/core";
import { PlayerService } from "../services/player.service";
import { InterfacePlayer } from "../types/player";

@Component({
    selector: "app-playerlist",
    templateUrl: "playerlist.component.html",
    styleUrls: ["playerlist.component.scss"]
}) export class PlayerListComponent implements OnInit {

    constructor(
        private playerService: PlayerService,
    ) {
        this.playerService.players().subscribe((value) => {
            this.playerName = value;
        });
    }


    @Input() public players: InterfacePlayer[];
    public playerName;


    public ngOnInit() {
        setTimeout(() => {
            this.playerService.addPlayer("test");
            console.log("XXX");
        }, 2000);
    }

}
