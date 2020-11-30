import React, { createContext, useEffect, useState } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase";
import "firebase/auth";

export const AppContext = createContext(null);

var firebaseConfig = {
  apiKey: "AIzaSyAjZImrVuRmlMXD8EI4vFNmIG7Oldt-L7s",
  authDomain: "user-app-2a81c.firebaseapp.com",
  databaseURL: "https://user-app-2a81c.firebaseio.com",
  projectId: "user-app-2a81c",
  storageBucket: "user-app-2a81c.appspot.com",
  messagingSenderId: "236798103498",
  appId: "1:236798103498:web:36f9a84b79f59fc77c8933",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();
const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider(),
};

const AppProvider = ({ children, signInWithGoogle, user, signOut }) => {
  const [appUser, setAppUser] = useState({});
  const [message, setMessage] = useState("");
  const handleSignOut = () => {
    signOut();
    setAppUser({});
  };
  useEffect(() => {
    if (user) {
      // console.log(user);
      // setAppUser({
      //   displayName: user.displayName,
      //   email: user.email,
      //   photoURL: user.photoURL,
      // });
      fetch("/users", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then((json) => {
          setAppUser(json.data);
          setMessage(json.message);
        });
    }
  }, [user]);
  return (
    <AppContext.Provider
      value={{ signInWithGoogle, appUser, handleSignOut, message }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth,
})(AppProvider);
