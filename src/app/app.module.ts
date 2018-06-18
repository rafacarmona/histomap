import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ComponentsModule } from '../components/components.module';
import { MyApp } from './app.component';
//Modulos importados
import { AngularFireAuthModule } from 'angularfire2/auth';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore'; //imports para guardar en la database
import { NativeAudio } from '@ionic-native/native-audio';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
//Paginas
import { LoginPage } from '../pages/login/login';
import { menuPrincipalPage } from '../pages/menu-principal/menu-principal';
import { ElegirJuegoPage } from '../pages/elegir-juego/elegir-juego';
import { JuegoPage } from '../pages/juego/juego';
import { ConfiguracionPage } from '../pages/configuracion/configuracion';
import { ModalPreguntasPage } from '../pages/modal-preguntas/modal-preguntas';
import { PuntuacionesPage } from '../pages/puntuaciones/puntuaciones';

export const firebaseConfig = {
  apiKey: "AIzaSyCanO4lE7xtcDZGRBUYc_wT4PmUKkjI8Xc",
  authDomain: "histomap-e10e6.firebaseapp.com",
  databaseURL: "https://histomap-e10e6.firebaseio.com",
  projectId: "histomap-e10e6",
  storageBucket: "histomap-e10e6.appspot.com",
  messagingSenderId: "239887585272"
}

firebase.initializeApp(firebaseConfig);
@NgModule({
  declarations: [
    MyApp,
    LoginPage,      // loginPage will be here not in imports  
    menuPrincipalPage,
    ElegirJuegoPage,
    JuegoPage,
    ConfiguracionPage,
    ModalPreguntasPage,
    PuntuacionesPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    ComponentsModule,
    //import de database
    AngularFirestoreModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    menuPrincipalPage,
    ElegirJuegoPage,
    JuegoPage,
    ConfiguracionPage,
    ModalPreguntasPage,
    PuntuacionesPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    NativeAudio,
    Camera,
    Network,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GooglePlus
  ]
})
export class AppModule {}
