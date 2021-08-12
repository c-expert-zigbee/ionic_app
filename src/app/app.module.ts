import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Network } from '@ionic-native/network/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './inteceptors';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Toast } from '@ionic-native/toast/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthModule } from './pages/auth/auth.module';
import { SelectRegionModalPageModule } from './pages/select-region-modal/select-region-modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModifyAdsPage } from './modals/modal-modify-ads/modal-modify-ads.page';
import { ModalCompleteAdsComponent } from './modals/modal-complete-ads/modal-complete-ads.component';

@NgModule({
  declarations: [AppComponent, ModalModifyAdsPage, ModalCompleteAdsComponent],
  entryComponents: [ModalModifyAdsPage, ModalCompleteAdsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios',
      backButtonText: '',
      backButtonIcon: 'arrow-back',
      scrollPadding: false,
      scrollAssist: false
    }),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    AuthModule,
    SelectRegionModalPageModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AppVersion,
    Network,
    httpInterceptorProviders,
    InAppBrowser,
    Toast,
    SQLite,
    Keyboard,
    SocialSharing
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
