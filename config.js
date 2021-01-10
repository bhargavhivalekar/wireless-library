 import * as firebase from "firebase";
 require("@firebase/firestore")
 
 var firebaseConfig = {
  apiKey: "AIzaSyDAtENUXUk2a8Ht4CL8dM5DpoX-YMa3jtc",
  authDomain: "wireleibrary-5da0a.firebaseapp.com",
  projectId: "wireleibrary-5da0a",
  storageBucket: "wireleibrary-5da0a.appspot.com",
  messagingSenderId: "441607218791",
  appId: "1:441607218791:web:a3241230ec4b748bac56c2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

  export default firebase.database();