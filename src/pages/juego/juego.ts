import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, AlertController, ModalController, Modal } from 'ionic-angular';
import { ModalPreguntasPage } from '../modal-preguntas/modal-preguntas';
import * as firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

interface userInformation{
  email?: string;
  image?: string;
  name?: string;
  puntuacion?: number
}

declare var google;

@Component({
  selector: 'page-juego',
  templateUrl: 'juego.html',
})
export class JuegoPage {

  preguntas: any;
  puntos: number;
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  currentUser: firebase.User;
  title : string;
  currentCollection: string;
  todoCollection: AngularFirestoreDocument<userInformation>; 
  partidaFinalizada: boolean;
  numeroPregunta: number;
  marcadores = [];
  informacionPregunta: string;
  imagenPregunta: string;
  ahorroDatos: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController, public modalCtrl: ModalController, private db: AngularFirestore) {
    this.puntos = 0;
    this.currentCollection = "users";
    this.partidaFinalizada = false;
    this.numeroPregunta = 0;
    this.marcadores = new Array();
    this.ahorroDatos = localStorage.getItem('ahorrarDatos') == 'true' ? true : false;
  }

  ionViewDidLoad() {
    this.preguntas = this.navParams.get('preguntas');
    this.title = this.navParams.get('titulo');
    this.currentUser = firebase.auth().currentUser;

    //Variable que se usara para almacenar todas las posiciones para poder mostrar la linea que une los marcadores
    let coordenadas = [];
    //Opciones para el mapa
    let mapOptions = {
      center: new google.maps.LatLng(this.preguntas[0].localizacion._lat, this.preguntas[0].localizacion._long),
      zoom: 11,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true
    }
    //Se carga el mapa
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    //Rellenamos la variable con las coordenadas para la linea, creamos el mensaje del marcador y creamos el marcador y le añadimos el mensaje
    this.preguntas.forEach((element, index:number) => {
      this.informacionPregunta = element.informacion;
      this.imagenPregunta = element.imagen;

      coordenadas.push({lat: element.localizacion._lat, lng: element.localizacion._long});

      let posicionMarcador = new google.maps.LatLng(element.localizacion._lat, element.localizacion._long);
      let marker = new google.maps.Marker({
        position: posicionMarcador,
        map: this.map,
        animation: google.maps.Animation.BOUNCE,
        icon: "assets/imgs/caja.png",
        title: ""+index
      });

      this.marcadores.push(marker);

      if(Number.parseInt(marker.getTitle()) != this.numeroPregunta){
        marker.setAnimation(null);
      }

      let eventoMarcador= marker.addListener('click', () => {
        if(Number.parseInt(marker.getTitle()) == this.numeroPregunta){
      
        let modal:Modal = this.modalCtrl.create(ModalPreguntasPage, { pregunta: element });
        modal.present();
        modal.onWillDismiss((data) => {
          if(data.pulsado){
            this.puntos += data.puntos;
            google.maps.event.removeListener(eventoMarcador);

            if(data.puntos != 0){
              marker.setIcon("assets/imgs/bien.png");
            }else{
              marker.setIcon("assets/imgs/mal.png");
            }

            if(this.preguntas.length != index+1){
              let coordenadasJugado = [];
              this.map.setCenter(new google.maps.LatLng(this.preguntas[index+1].localizacion._lat, this.preguntas[index+1].localizacion._long));
              coordenadasJugado.push({lat: element.localizacion._lat, lng:element.localizacion._long});
              coordenadasJugado.push({lat: this.preguntas[index+1].localizacion._lat, lng:this.preguntas[index+1].localizacion._long});
              //Crea la linea que une los marcadores
              let lineas = new google.maps.Polyline({
                path: coordenadasJugado,
                geodesic: true,
                strokeColor: '#4caf50',
                strokeOpacity: 1.0,
                strokeWeight: 3
              });
              //La pinta en el mapa
              lineas.setMap(this.map);
              this.marcadores[index].setAnimation(null);
              this.marcadores[index+1].setAnimation(google.maps.Animation.BOUNCE);

              this.informacionPregunta = element.informacion;
              this.imagenPregunta = element.imagen;
              
            }else{
              this.marcadores[index].setAnimation(null);
              let alert = this.alertCtrl.create({
                title: 'Información',
                subTitle: '¡Has contestado todas las preguntas!',
                buttons: ['Ok']
              });
              alert.present();

              let documento :AngularFirestoreDocument<userInformation>;
              this.todoCollection = this.db.collection(this.currentCollection).doc(this.currentUser.uid);
              this.todoCollection.ref.get().then(user =>{
                documento = this.db.collection(this.currentCollection).doc(this.currentUser.uid);             
                documento.set({puntuacion:this.puntos+Number.parseInt(user.data().puntuacion)}, {merge:true});
              });  
              
              this.partidaFinalizada = true;
            }

            this.numeroPregunta++; 
          }
        }); 
      }
    });

  });

    //Crea la linea que une los marcadores
    let lineas = new google.maps.Polyline({
      path: coordenadas,
      geodesic: true,
      strokeColor: '#f44336',
      strokeOpacity: 1.0,
      strokeWeight: 3
    });
    //La pinta en el mapa
    lineas.setMap(this.map);     
  }

  ionViewCanLeave(){
    if(this.partidaFinalizada){
      return true;
    }else{
      return new Promise((resolve, reject) => {
        let alert = this.alertCtrl.create({
          title: 'Información',
          subTitle: 'Si sales ahora no se guardara tu puntuación, ¿Quieres salir igualmente?',
          buttons: [
            {
              text: 'No',
              handler: () => {
                reject();
              }
            },
            {
              text: 'Si',
              handler: () => {
                //alert.dismiss().then(() => resolve()).catch(() => {});
                resolve();
              }
            }
          ]
        });
        alert.present();
      });
    }
  }

  informacion(){
    let mensaje;
    if(this.ahorroDatos){
      mensaje = "<p>"+this.informacionPregunta+"</p>";
    }else{
      mensaje = "<img src='"+this.imagenPregunta+"'><p>"+this.informacionPregunta+"</p>";
    }
    
    let alert = this.alertCtrl.create({
      title: 'Información',
      subTitle: mensaje,
      buttons: ['Ok']
    });
    alert.present();

  }
}
