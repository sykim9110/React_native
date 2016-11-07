import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import Button from 'react-native-button';

import firebase from 'firebase';
const app = firebase.initializeApp({
    apiKey: "AIzaSyBAP6CGUxpBlN9N6G0_bW_pNRg91idBdhQ",
    authDomain: "shake-d5274.firebaseapp.com",
    databaseURL: "https://shake-d5274.firebaseio.com",
    storageBucket: "shake-d5274.appspot.com",
    messagingSenderId: "181749609109"
});

export default class Signin extends Component {

    constructor(props) {
        super(props);
        this.state = {
          Signin: false,
          email: '',
          password: '',
          verifyEmail: false,
          signinStatus: 'Sign in',
          noServer: 'false'
        }
        //이메일 auth
        this.toggleSignIn = this.toggleSignIn.bind(this);
        this.handleSignUp = this.handleSignUp.bind(this);
        this.sendEmailVerification = this.sendEmailVerification.bind(this);
        this.sendPasswordReset = this.sendPasswordReset.bind(this);

        //구글 auth
        this.onSignInGoogle = this.onSignInGoogle.bind(this);


    }

    // *Handles the sign in button press.
    toggleSignIn() {
        if (firebase.auth().currentUser) {
          // [START signout]
          firebase.auth().signOut();
          // [END signout]
        } else {
          var email = this.state.email;
          var password = this.state.password;
          if (email.length < 4) {
            alert('이메일을 입력하세요')
            return;
          }
          if (password.length < 4) {
            alert('비밀번호를 입력하세요')
            return;
          }
          // Sign in with email and pass.
          // [START authwithemail]
          firebase.auth().signInWithEmailAndPassword(email, password).catch((error) => {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
              alert('비밀번호가 일치하지 않습니다');
            } else {
              alert(errorMessage);
            }
            console.log(error);
            this.setState({Signin: false});
            // [END_EXCLUDE]
        });
        // [END authwithemail]
      }
      this.setState({Signin: true});
    }

    // *Handles the Sign up button press.
    handleSignUp() {
        var email = this.state.email;
        var password = this.state.password;
        if(email.length < 4) {
          alert('이메일을 입력하세요')
          return;
        }
        if (password.length < 4) {
          alert('비밀번호를 입력하세요')
          return;
        }
        // Sign in with email and pass.
        // [START createwithemail]
        firebase.auth().createUserWithEmailAndPassword(email, password).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode == 'auth/weak-password') {
            alert('비밀번호를 더 어렵게 설정하세요');
          } else {
            alert(errorMessage);
          }
          console.log(error);
          // [END_EXCLUDE]
        });
        // [END createwithemail]
    }

    // *Sends an email verification to the user.
    sendEmailVerification() {
        // [START sendemailverification]
        firebase.auth().currentUser.sendEmailVerification().then(() => {
        // Email Verification sent!
        // [START_EXCLUDE]
        alert('이메일로 확인 메일을 보냈습니다.'); //Email Verification Sent!
        // [END_EXCLUDE]
        });
        // [END sendemailverification]
    }

    sendPasswordReset() {
        var email = this.state.email;
        // [START sendpasswordemail]
        firebase.auth().sendPasswordResetEmail(email).then(() => {
          // Password Reset Email Sent!
          // [START_EXCLUDE]
          alert('이메일로 메일을 보냈습니다.'); //Password Reset Email Sent!
          // [END_EXCLUDE]
        }).catch((error) => {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // [START_EXCLUDE]
          if (errorCode == 'auth/invalid-email') {
            alert(errorMessage);
          } else if (errorCode == 'auth/user-not-found') {
            alert(errorMessage);
          }
          console.log(error);
          // [END_EXCLUDE]
        });
        // [END sendpasswordemail];
    }

    // [START googlecallback]
    onSignInGoogle(googleUser) {
      alert('Google Auth Response', googleUser); //console.log 였음
      // We need to register an Observer on Firebase Auth to make sure auth is initialized.
      var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
      unsubscribe();
      // Check if we are already signed-in Firebase with the correct user.
        if (!isUserEqual(googleUser, firebaseUser)) {
          // Build Firebase credential with the Google ID token.
          // [START googlecredential]
          var credential = firebase.auth.GoogleAuthProvider.credential(
              googleUser.getAuthResponse().id_token);
          // [END googlecredential]
          // Sign in with credential from the Google user.
          // [START authwithcred]
            firebase.auth().signInWithCredential(credential).catch((error) => {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              // The email of the user's account used.
              var email = error.email;
              // The firebase.auth.AuthCredential type that was used.
              var credential = error.credential;
              // [START_EXCLUDE]
                if (errorCode === 'auth/account-exists-with-different-credential') {
                  alert('You have already signed up with a different auth provider for that email.');
                  // If you are using multiple auth providers on your app you should handle linking
                  // the user's accounts here.
                } else {
                  alert(error); //console.log
                }
                 // [END_EXCLUDE]
            });
             // [END authwithcred]
        } else {
          alert('User already signed-in Firebase.'); //console.log
        }
      });
    }

     /**
     * Check that the given Google user is equals to the given Firebase user.
     */
    // [START checksameuser]
    isUserEqual(googleUser, firebaseUser) {
      if (firebaseUser) {
        var providerData = firebaseUser.providerData;
        for (var i = 0; i < providerData.length; i++) {
          if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
              providerData[i].uid === googleUser.getBasicProfile().getId()) {
            // We don't need to reauth the Firebase connection.
            return true;
          }
        }
      }
      return false;
    }
    // [END checksameuser]

    /**
     * Handle the sign out button press.
     */
    handleSignOut() {
      var googleAuth = gapi.auth2.getAuthInstance();
      googleAuth.signOut().then(() => {
        firebase.auth().signOut();
      });
    }

    /**
     *  handles setting up UI event listeners and registering Firebase auth listeners:
     *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
     *    out, and that is where we update the UI.
     */
    componentDidMount() {
      alert('load END')


      // Listening for auth state changes.
      // [START authstatelistener]
      firebase.auth().onAuthStateChanged((user) => {
        // [START_EXCLUDE silent]
        this.setState({verifyEmail: false});
        // [END_EXCLUDE]
        if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          // [START_EXCLUDE silent]
          this.setState({signinStatus: 'Sign out'});
          if (!emailVerified) {
            this.setState({verifyEmail: true});
          }
          // [END_EXCLUDE]
        } else {
          // User is signed out.
          // [START_EXCLUDE silent]
          this.setState({signinStatus: 'Sign in'});
          // [END_EXCLUDE]
        }
        // [START_EXCLUDE silent]
        // **document.getElementById('quickstart-sign-in').disabled = false;
        // [END_EXCLUDE]
      });
      // [END authstatelistener]
      this.setState({noServer: 'good'})
      // document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
      // document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
      // document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
      // document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);
    }

    render() {
      let verifyEmail = (
        <Button
          containerStyle={styles.buttonContainer}
          style={styles.button}
          styleDisabled={{color: '#FD9280'}}
          onPress={this.sendEmailVerification}>
          SEND EMAIL VERIFICATION
        </Button>
      );

      return (
        <View>
          <View>
            <Text>ID</Text>
            <TextInput
              placeholder="email"
              onChangeText={(text) => this.setState({email: text})}
              value={this.state.text}/>
            <Text>PASSWORD</Text>
            <TextInput
              placeholder="password"
              onChangeText={(text) => this.setState({password: text})}
              value={this.state.text}/>
          </View>
          <View>
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.button}
              styleDisabled={{color: '#FD9280'}}
              onPress={this.toggleSignIn}>
              {this.state.signinStatus}
            </Button>
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.button}
              styleDisabled={{color: '#FD9280'}}
              onPress={this.handleSignUp}>
              Sign up
            </Button>
            {this.state.verifyEmail ? verifyEmail : null}
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.button}
              styleDisabled={{color: '#FD9280'}}
              onPress={this.sendPasswordReset}>
              SEND PASSWORD RESET EMAIL
            </Button>
            <Button
              containerStyle={styles.buttonContainer}
              style={styles.button}
              styleDisabled={{color: '#FD9280'}}
              onPress={this.onSignInGoogle}>
              Google Login
            </Button>
          </View>
          <Text>{this.state.googleToken}</Text>
          <Text>{this.state.noServer}</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
      margin:5,
      padding:10,
      height:45,
      overflow:'hidden',
      borderRadius:4,
      backgroundColor: '#FE7D7C'
    },
    button: {
      fontSize: 20,
      color: '#FEE2D7'
    }
});
