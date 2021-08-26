// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from "firebase";
const firebaseConfiguration = {
  apiKey: "AIzaSyDop8dw8GDtz7MPDZbml4OeZfvbQoXSI6c",
  authDomain: "chat-application-9c42e.firebaseapp.com",
  projectId: "chat-application-9c42e",
  storageBucket: "chat-application-9c42e.appspot.com",
  messagingSenderId: "607517924540",
  appId: "1:607517924540:web:5361b20580e4dda6ba44b9",
  measurementId: "G-8LJHFVB8VC",
};
firebase.initializeApp(firebaseConfiguration);
const Auth = firebase.auth();
const dataBase = firebase.firestore();

export { Auth, dataBase };
