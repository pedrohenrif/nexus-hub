import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase (substitua com suas chaves reais quando criar o projeto no console)
// Por enquanto, para funcionar no ambiente local, você precisará criar um projeto no firebase.google.com
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJECT.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_PROJECT.appspot.com",
  messagingSenderId: "...",
  appId: "..."
};

// Se não tiver a config ainda, o app não vai quebrar, mas não vai salvar dados
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);