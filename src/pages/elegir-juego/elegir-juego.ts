import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//nuevo para firestore cloud
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { JuegoPage } from '../juego/juego';

interface ToDo{
  title: string;
  preguntas: any;
  id?: string;
}

@Component({
  selector: 'page-elegir-juego',
  templateUrl: 'elegir-juego.html'
})

export class ElegirJuegoPage {

  //database log
  todoCollection: AngularFirestoreCollection<ToDo>; 
  juegos: Observable<ToDo[]>;
  currentCollection: string;

  constructor( public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore) {
    this.currentCollection = 'games';
  }

  ionViewDidEnter(){
      this.todoCollection = this.db.collection(this.currentCollection);
      setTimeout(()=>{
        this.juegos = this.todoCollection.valueChanges();
      }, 1000);
  }

  abrirJuego(preguntas, titulo){
    this.navCtrl.push(JuegoPage, {'preguntas':  preguntas, 'titulo':titulo});
  }

}
