import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import{getAuth, onAuthStateChanged, signOut} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js"

import{getFirestore, getDoc, doc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"


const firebaseConfig = {
    apiKey: "AIzaSyB7fRpF0eSWKVuGPnAtzms1APEnGPsrJB8",
    authDomain: "login-form-299d2.firebaseapp.com",
    projectId: "login-form-299d2",
    storageBucket: "login-form-299d2.appspot.com",
    messagingSenderId: "434780237400",
    appId: "1:434780237400:web:492b2f63e7f6816e20e42d"
  };
 
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  const auth=getAuth();
  const db=getFirestore();

  onAuthStateChanged(auth, (user)=>{
    const loggedInUserId=localStorage.getItem('loggedInUserId');
    if(loggedInUserId){
        console.log(user);
        const docRef = doc(db, "users", loggedInUserId);
        getDoc(docRef)
        .then((docSnap)=>{
            if(docSnap.exists()){
                const userData=docSnap.data();
                document.getElementById('loggedUserFName').innerText=userData.firstName;
                document.getElementById('loggedUserEmail').innerText=userData.email;
                document.getElementById('loggedUserLName').innerText=userData.lastName;

            }
            else{
                console.log("No Document Found matching id")
            }
        })
        .catch((error)=>{
            console.log("Error getting document");
        })
    }
    else{
        console.log("User Id not Found in Local storage")
    }
  })

  const logoutButton=document.getElementById('logout');

  logoutButton.addEventListener('click',()=>{
    localStorage.removeItem('loggedInUserId');
    signOut(auth)
    .then(()=>{
        window.location.href='index_1.html';
    })
    .catch((error)=>{
        console.error('Error Signing out:', error);
    })
  })