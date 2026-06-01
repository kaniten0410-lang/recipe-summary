/* -------------------------------------------------------------------------- */
/*                                 Firebase接続                               */
/* -------------------------------------------------------------------------- */
const firebaseConfig = {
    apiKey: "AIzaSyBHRMw7HsDHA0tVjgfDyYnGEetYSiJW0eI",
    authDomain: "recipe-summary-10e8e.firebaseapp.com",
    projectId: "recipe-summary-10e8e",
    storageBucket: "recipe-summary-10e8e.firebasestorage.app",
    messagingSenderId: "521772735902",
    appId: "1:521772735902:web:021c4f9d2d4b4091dc8a8f"
};

// Firebaseを初期化
firebase.initializeApp(firebaseConfig);
// Firestoreを使えるようにする
const db = firebase.firestore();
// 全データを格納する変数
let allData = null;

async function getData() {
  if (allData) return allData; // キャッシュがあればそれを返す
  const snapshot = await db.collection('recipes').get();
  allData = snapshot.docs.map(doc => doc.data());
  return allData;
}