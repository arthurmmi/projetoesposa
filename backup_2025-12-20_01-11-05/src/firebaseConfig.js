import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBfbTfK7OW5ooJ-_73Vgzsy-lKnmgeIKGU",
    authDomain: "projetoparaesposa.firebaseapp.com",
    projectId: "projetoparaesposa",
    storageBucket: "projetoparaesposa.firebasestorage.app",
    messagingSenderId: "1037898533340",
    appId: "1:1037898533340:web:f21c772a988419965d2719",
    measurementId: "G-QQ2B471BHG"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
// Inicializa o Banco de Dados
const db = getFirestore(app);
// Inicializa o Storage
const storage = getStorage(app);

export { db, storage };