/* -------------------------------------------------------------------------- */
/*                                 Firebase接続                               */
/* -------------------------------------------------------------------------- */
// 全データを格納する変数
let allData = null;

const firebaseConfig = {
    apiKey: "AIzaSyBHRMw7HsDHA0tVjgfDyYnGEetYSiJW0eI",
    authDomain: "recipe-summary-10e8e.firebaseapp.com",
    projectId: "test-dummy-project",
    storageBucket: "recipe-summary-10e8e.firebasestorage.app",
    messagingSenderId: "521772735902",
    appId: "1:521772735902:web:021c4f9d2d4b4091dc8a8f"
};

// Firebaseを初期化
firebase.initializeApp(firebaseConfig);
// Firestoreを使えるようにする
const db = firebase.firestore();

// allDataにレシピデータを取得・キャッシュする関数
async function getData() {
  // 既にキャッシュが存在する場合はそれを返す
  if (allData) return allData; 
  // Firestoreからすべてのレシピを取得する
  const snapshot = await db.collection('recipes').get();
  // ドキュメントデータの配列としてallDataにキャッシュする
  allData = snapshot.docs.map(doc => doc.data());
  return allData;
}