// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
apiKey: "AIzaSyD5Myw_8XG20WfRw6a-rGIh_tgOZxRtnqk",
authDomain: "data-repository-91610.firebaseapp.com",
projectId: "data-repository-91610",
storageBucket: "data-repository-91610.firebasestorage.app",
messagingSenderId: "1001690812918",
appId: "1:1001690812918:web:079a34d76c54b82a7cf7d7",

measurementId: "G-J5GFFVKV7F",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

const analytics = getAnalytics(app);