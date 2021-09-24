import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy, RouterModule, Routes } from "@angular/router";

import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

import { AppComponent } from "./app.component";
import { TimerPage } from "./timer/timer.page";
import { NativeStorage } from "@ionic-native/native-storage/ngx";
import { SettingsPage } from "./settings/settings.page";
import { PlayerListComponent } from './playerlist/playerlist.component';
import { FormatTimePipe } from './pipe/formatTimepipe';


const routes: Routes = [
  { path: "", component: TimerPage },

];

@NgModule({
  declarations: [
    AppComponent,
    PlayerListComponent,
    TimerPage,
    SettingsPage,

    // Pipes
    FormatTimePipe
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeStorage,
    FormatTimePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
