// Firebase App is always required and must be first
var firebase = require("firebase/app");

// Add additional services you want to use
require("firebase/auth");
require("firebase/firestore");
require("firebase/storage");

var config = {
  apiKey: "AIzaSyD-udtqbQ8P-sA0DLrfSnuGS_Tx-fuWq_A",
  authDomain: "lienzos-u.firebaseapp.com",
  databaseURL: "https://lienzos-u.firebaseio.com",
  projectId: "lienzos-u",
  storageBucket: "lienzos-u.appspot.com",
  messagingSenderId: "475810546416"
};

firebase.initializeApp(config);
firebase.firestore().settings({ timestampsInSnapshots: true })

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export {auth, db, storage, firebase};

