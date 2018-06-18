import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import firebase from 'firebase';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NativeAudio } from '@ionic-native/native-audio';
import { Camera, CameraOptions } from '@ionic-native/camera';

interface userInformation{
  email?: string;
  image?: string;
  name?: string;
}

@Component({
  selector: 'page-configuracion',
  templateUrl: 'configuracion.html'
})

export class ConfiguracionPage {
  currentCollection: string;
  currentUser: firebase.User;
  userDocument: AngularFirestoreDocument<userInformation>;
  user: User;
  soundValue: number;
  ahorroDatos: boolean;

  constructor(public navCtrl: NavController, private db: AngularFirestore, public toastCtrl: ToastController, private nativeAudio: NativeAudio, private camera: Camera) {
    this.currentCollection = "users";
    this.currentUser = null;
    this.user = new User();
    this.ahorroDatos = localStorage.getItem('ahorrarDatos') == 'true' ? true : false;
  }
  
  getPicture(){
    let options: CameraOptions = {
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: 1000,
      targetHeight: 1000,
      quality: 100
    }
    let imgUrl;
    //let storageRef = firebase.storage().ref('images');
    this.camera.getPicture( options )
    .then(imageData => {
      let d = new Date();
      const selfieRef = firebase.storage().ref(`profilePictures/${this.currentUser.uid}/profilePicture/${d.getMilliseconds}.png`);
      selfieRef
        .putString(imageData, 'base64', {contentType: 'image/png'})
        .then(savedProfilePicture => {
          imgUrl = savedProfilePicture.downloadURL;
          firebase.database().ref(`users/${this.currentUser.uid}`).set(imgUrl);
          this.userDocument.set({image: imgUrl}, {merge: true});
        });
    })
    .catch(error =>{
      console.error( error );
    });
  }

  mensajeToast(message, position = "bottom", showCloseButton = false, closeButtonText ="Ok", cssClass = "", duration = null){
    let toast = this.toastCtrl.create({
      message: message,
      position: position,
      showCloseButton: showCloseButton,
      closeButtonText: closeButtonText,
      cssClass: cssClass,
      duration: duration
    });
    return toast;
  }

  ionViewDidEnter(){
    try{
      this.currentUser = firebase.auth().currentUser;
      /*this.userCollection = this.db.collection('users', ref => ref.where('email', '==', currentUser.email));
      this.users = this.userCollection.valueChanges();*/
      this.userDocument = this.db.collection(this.currentCollection).doc(this.currentUser.uid);
      this.userDocument.valueChanges().subscribe(ref => this.user = ref);
      setTimeout(()=>{
        if(!this.user.image){
          this.user.image = this.currentUser.photoURL;
        }
        if(!this.user.name){
          this.user.name = this.currentUser.displayName;
        }
      }, 2000);
// url('../assets/imgs/background.jpg');
    }catch(err){
      let toastError = this.mensajeToast('No se pudieron cargar los datos.', "middle", true, "Vale", 'toastError');
      toastError.present();
    }

  }

  guardarVolumen(){
    this.nativeAudio.setVolumeForComplexAsset('musica', this.soundValue/10);
  }

  guardarNombre(){
    if(this.user.name.length > 3){
     // this.userDocument.update({name: this.user.name});
     this.userDocument.set({name: this.user.name, image: this.user.image}, {merge: true});
    }else{
      let toastError = this.mensajeToast('La longitud del nombre no puede ser menor a 3.', "bottom", true, "Vale", 'toastSave');
      toastError.present();
    }
  }

  ionViewCanLeave(){
    if(this.ahorroDatos){
      localStorage.setItem('ahorrarDatos', 'true');
    }else{
      localStorage.setItem('ahorrarDatos', 'false');
    }
  }

}

class User {
  email?: string;
  image?: string;
  name?: string;
  constructor(name = null, image = null, email = null){
    this.name = name;
    this.image = image;
    this.email = email;
  }
}