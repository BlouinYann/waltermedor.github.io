// firebase-init.js
// Initialisation partagée de Firebase (Auth + Firestore).
// Ce fichier est importé par login.html, admin.html et index.html.
//
// 1. Va sur https://console.firebase.google.com
// 2. Crée un projet (gratuit, plan "Spark")
// 3. Ajoute une application Web ("</>") -> copie la config ci-dessous
// 4. Active "Authentication" > méthode "Adresse e-mail/Mot de passe"
// 5. Crée manuellement un utilisateur admin (Authentication > Users > Ajouter un utilisateur)
// 6. Active "Firestore Database" (mode production)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// --- À REMPLACER par la configuration de TON projet Firebase ---
const firebaseConfig = {
  apiKey: "AIzaSyDizGiKyzrAnQeNSTIsfhiNFzNosr1Pi5Q",
  authDomain: "waltermedor.firebaseapp.com",
  projectId: "waltermedor",
  storageBucket: "waltermedor.firebasestorage.app",
  messagingSenderId: "570883696304",
  appId: "1:570883696304:web:d90d9007608935d4037d75"
};
// -----------------------------------------------------------------

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where
};
