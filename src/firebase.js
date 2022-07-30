import firebase from "firebase/app"
import "firebase/auth"

const app = firebase.initializeApp({
    apiKey: process.env.DEV_REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.DEV_REACT_APP_FIREBASE_DOMAIN_KEY,
    projectId: process.env.DEV_REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.DEV_REACT_APP_FIREBASE_STORAGE,
    messagingSenderId: process.env.DEV_REACT_APP_FIREBASE_SENDER_ID,
    appId: process.env.DEV_REACT_APP_FIREBASE_APP_ID,
    measurementId: process.env.DEV_REACT_APP_FIREBASE_MEASUREMENT_ID
})

export const auth = app.auth()
export default app