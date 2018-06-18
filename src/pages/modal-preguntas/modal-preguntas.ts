import { Component } from '@angular/core';
import { NavParams, ViewController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-modalpreguntas',
  templateUrl: 'modal-preguntas.html',
})
export class ModalPreguntasPage {

  preguntas: any;
  tituloPregunta: string;
  respuestas: String[];
  respuestaCorrecta: string;
  puntos: number;
  pulsado: boolean;
  botones: any;
  permitirSalir: boolean;
  botonCerrar: boolean;

  constructor(private viewCtrl: ViewController, private navParams: NavParams, private toastCtrl: ToastController) {
    this.puntos = 0;
    this.pulsado = false;
    this.permitirSalir = true;
    this.botonCerrar = true;
  }

  ionViewDidLoad() {
    this.preguntas = this.navParams.get("pregunta");
    this.mostrarTexto();
  }

  mostrarTexto(){
    //Le quita la clase que cambia el color para evitar que salga pintado en otra pregunta
    this.botones = document.getElementsByClassName("botonRespuesta");
    for(let i = 0; i < this.botones.length; i++){
      if(this.botones[i].className.includes("respuestaIncorrecta")){
        this.botones[i].className = this.botones[i].className.replace(/\brespuestaIncorrecta\b/g, "");
      }else if(this.botones[i].className.includes("respuestaCorrecta")){
        this.botones[i].className = this.botones[i].className.replace(/\brespuestaCorrecta\b/g, "");
      }
    }
  
    // Recogemos los campos que mostraremos guardando la respuesta correcta para luego usarla en la comprobacion
    this.respuestas = [];
    this.tituloPregunta = this.preguntas.pregunta;

    for(let indice in this.preguntas.respuestas){
      if(/~\w+/i.test(this.preguntas.respuestas[indice])){
        this.respuestaCorrecta = this.preguntas.respuestas[indice].substr(1);
        this.respuestas.push(this.preguntas.respuestas[indice].substr(1));
      }else{
        this.respuestas.push(this.preguntas.respuestas[indice]);
      }      
    }
  }

  //Comprueba que la respuesta elegida es correcta o no
  cambiarColorBoton(respuestaUsuario){   
    if(!this.pulsado){
      this.permitirSalir = false;
      this.pulsado = true;
      for(let i = 0; i < this.botones.length; i++){
        if(this.botones[i].firstElementChild.innerHTML == respuestaUsuario){
          this.botones[i].className += " botonSeleccionado";
        }
      }
      setTimeout(() =>  this.comprobarRespuesta(respuestaUsuario), 2000);   
    }
    
  }

  comprobarRespuesta(respuestaUsuario){
    if(respuestaUsuario == this.respuestaCorrecta){
      for(let i = 0; i < this.botones.length; i++){
        if(this.botones[i].firstElementChild.innerHTML == respuestaUsuario){
          this.botones[i].className += " respuestaCorrecta";
        }
      }
      this.puntos += this.preguntas.puntos;

      let toast = this.toastCtrl.create({
        message: 'Respuesta correcta +'+this.preguntas.puntos+' puntos',
        duration: 3000,
        position: 'bottom'
      });       
      toast.present();
    }else{
      for(let i = 0; i < this.botones.length; i++){
        if(this.botones[i].firstElementChild.innerHTML == respuestaUsuario){
          this.botones[i].className += " respuestaIncorrecta";
        }else if(this.botones[i].firstElementChild.innerHTML == this.respuestaCorrecta){
          this.botones[i].className += " respuestaCorrecta";       
        }
      }
      
      let toast = this.toastCtrl.create({
        message: 'Respuesta incorrecta',
        duration: 3000,
        position: 'bottom'
      });       
      toast.present();
    }
    this.permitirSalir = true;
    this.botonCerrar = false;
  }

  cerrarModal(){
    if(this.permitirSalir){
      let parametros = {
        puntos:this.puntos,
        pulsado:this.pulsado
      }
  
      this.viewCtrl.dismiss(parametros);
    }
    
  }

}
