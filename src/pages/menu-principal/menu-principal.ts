import { Component } from '@angular/core';
import { NavController, AlertController  } from 'ionic-angular';
import { ElegirJuegoPage } from '../elegir-juego/elegir-juego';
import { LoginPage } from '../login/login';
import { ConfiguracionPage } from '../configuracion/configuracion';
import { PuntuacionesPage } from '../puntuaciones/puntuaciones';

import { GooglePlus } from '@ionic-native/google-plus';
import { Network } from '@ionic-native/network';

@Component({
  selector: 'menu-principal-home',
  templateUrl: 'menu-principal.html'
})
export class menuPrincipalPage {

  constructor(public navCtrl: NavController, public googleplus:GooglePlus, private network: Network, private alertCtrl: AlertController) {
    if (this.network.type != 'wifi' && localStorage.getItem('ahorrarDatos') == null) {
      let alert = this.alertCtrl.create({
        title: 'Información',
        subTitle: '¿Quieres quitar las imagenes para ahorrar datos?',
        buttons: [{
          text: 'No',
          role: 'no',
          handler: data => {
            localStorage.setItem('ahorrarDatos', 'false');
          }
        },
        {
          text: 'Si',
          handler: data => {
            localStorage.setItem('ahorrarDatos', 'true');
          }
        }],
        enableBackdropDismiss: false
      });
      alert.present();
    }
  }

  //Todos los metodos del menu

  irAJuegos(){
    this.navCtrl.push(ElegirJuegoPage);
  }

  irAConfiguracion(){
    this.navCtrl.push(ConfiguracionPage);
  }

  irAPuntuaciones(){
    this.navCtrl.push(PuntuacionesPage);
  }
  
  logout(){
    this.googleplus.logout().then(result => {
      this.navCtrl.setRoot(LoginPage);
    });
  }

}
