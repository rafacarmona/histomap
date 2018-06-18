import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { LoadingController } from 'ionic-angular';
import { menuPrincipalPage } from '../menu-principal/menu-principal';
import { Observable } from 'rxjs/Observable';

interface ToDo{
  email?: string;
  image?: string;
  name?: string;
  puntuacion?: number
}

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})

export class LoginPage {
  currentCollection: string;
  collection: AngularFirestoreCollection<ToDo>;
  userBBDD: Observable<ToDo[]>;
    constructor(public navCtrl: NavController, public googleplus:GooglePlus, private db: AngularFirestore, public loadingCtrl: LoadingController, private alertCtrl: AlertController) {
      this.currentCollection = 'users';
    }

  login(){
    let loader = this.loadingCtrl.create({
      content: "Cargado, por favor espera..."
    });
    loader.present();
      this.googleplus.login({
        'webClientId': '239887585272-gjdm723i0nkqdthgjn2grke0sqeg1q3o.apps.googleusercontent.com',
        'offline': false
      }).then(res=>{
        firebase.auth().signInWithCredential(firebase.auth.GoogleAuthProvider.credential(res.idToken))
          .then(suc=>{
            let user = firebase.auth().currentUser;
            this.collection = this.db.collection(this.currentCollection, ref => ref.where('email', "==", user.email));
            this.userBBDD = this.collection.valueChanges();
            this.userBBDD.subscribe(item => {
              if(item.length == 0){
                this.addUserToBbdd(user);
              }  
            });
            loader.dismiss();
            this.navCtrl.setRoot(menuPrincipalPage);
          }).catch(ns=>{
            let alert = this.alertCtrl.create({
              title: 'Información',
              subTitle: 'No se ha podido completar el login, revisa tu conexión a internet y vuelve a intentarlo.',
              buttons: ['Ok']
            });
            alert.present();
            loader.dismiss();
          });
      }).catch(err =>{
        loader.dismiss();
      });
  }

  //añadimos usuario
  addUserToBbdd(user){ 
    this.db.doc('users/' + user.uid).set({"email": user.email,"image":user.photoURL, "name":user.displayName, "puntuacion":0}, {merge: true}).then(newItem => {
      //el usuario no está en la base de datos y lo inserta.
    }).catch(err =>{
      //el usuario ya está en la base de datos.
    });
  }

}
