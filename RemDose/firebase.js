import * as firebase from "firebase";

//RESOURCES
/***************************************************************************************
*    
*    Title: React Native Firebase
*    Author: React Native Firebase
*    Availability: https://rnfirebase.io/
*
*    Title: React Native Authentication with Firebase and Expo in 27 minutes
*    Author: Made with Matt
*    Date: 2021
*    Availability: https://www.youtube.com/watch?v=ql4J6SpLXZA
*
*    Title: Connect Firebase to Expo Application
*    Author: Coders Life
*    Date: 2020
*    Availability: https://www.youtube.com/watch?v=wCl3uKmDzvI
*
***************************************************************************************/

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCTkvbEhRYXOtQDyca9x6jkIUfy3WyZ65U",
  authDomain: "remdose-auth.firebaseapp.com",
  projectId: "remdose-auth",
  storageBucket: "remdose-auth.appspot.com",
  messagingSenderId: "982210703102",
  appId: "1:982210703102:web:7a01062e1319f1ff773faf"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
    app = firebase.initializeApp(firebaseConfig);
}else {
    app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth()

export { db, auth };
