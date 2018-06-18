import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

interface ToDo{
  email?: string;
  image?: string;
  name?: string;
  puntuacion?: number
}

@Component({
  selector: 'page-puntuaciones',
  templateUrl: 'puntuaciones.html',
})
export class PuntuacionesPage {

  todoCollection: AngularFirestoreCollection<ToDo>; 
  users: Observable<ToDo[]>;
  currentCollection: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFirestore) {
    this.currentCollection = 'users';
  }

  ionViewDidLoad() {
    this.todoCollection = this.db.collection(this.currentCollection, ref => ref.orderBy('puntuacion', 'desc'));
      setTimeout(()=>{
        this.users = this.todoCollection.valueChanges();
      }, 1000);
  }

}
