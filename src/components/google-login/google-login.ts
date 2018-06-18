import { Component } from '@angular/core';
//import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs/Observable';
import { Platform } from 'ionic-angular';
import firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';
//import { AngularFireModule, FirebaseApp } from 'angularfire2';


@Component({
  selector: 'google-login',
  templateUrl: 'google-login.html'
})
export class GoogleLoginComponent {

  user: Observable<firebase.User>;

  constructor(private afAuth: AngularFireAuth, private gplus: GooglePlus, private platform: Platform) {
      this.user = this.afAuth.authState;

  }

  googleLogin(){
    if(this.platform.is('cordova')){
      this.nativeGoogleLogin();
    }else{
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin(): Promise<void>{
    try{
      const gplusUser = await this.gplus.login({
        'webClientId': '622727862365-j7niv7n7gf4qakt8m4epj6bmg03p4kjd.apps.googleusercontent.com',
        'offline': true,
        'scopes': 'profile email'
      })

      return await this.afAuth.auth.signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(gplusUser.idToken)
      )

    }catch(err){
      console.log(err);
    }
  }

  async webGoogleLogin(): Promise<void> {
    try{
      const provider = new firebase.auth.GoogleAuthProvider();
      //const credential = await this.afAuth.auth.signInWithPopup(provider);
      await this.afAuth.auth.signInWithPopup(provider);
    }catch(err){
      console.log(err);
    }
  }

  signOut(){
    this.afAuth.auth.signOut();
    if(this.platform.is('cordova')){
      this.gplus.logout();
    }
  }

}
