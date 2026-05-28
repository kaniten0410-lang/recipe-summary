// Firebase接続
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
let allData = [];
// 起動時にFirestoreからデータを全件取得する
db.collection('recipes').get().then(snapshot => {
  snapshot.forEach(doc => {
    allData.push(doc.data());
  });
  // リスト表示用
  loadtable(allData, 0);
});

// OGP画像取得
function get_ogp(url, imgElement, fallbackUrl = null) {
  if (url && url !== 'URL無し') {
    const gasUrl = 'https://script.google.com/macros/s/AKfycbxVmNg5RYgo7yKEcmJ9Q8SbYiONknuXKufVfM-Q67reNvjlZmyL6Wc0On8bLhCZyaQTNg/exec';
    fetch(`${gasUrl}?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(ogp => {
        if (ogp.success) {
          imgElement.src = ogp.imageUrl;
        } else if (fallbackUrl) {
          // 失敗時にfallbackUrlが指定されていれば使う
          imgElement.src = fallbackUrl;
          imgElement.classList.add('ogp-fallback');
        }
        imgElement.style.display = 'block';
      })
      .catch(() => {
        if (fallbackUrl) {
          imgElement.src = fallbackUrl;
          imgElement.classList.add('ogp-fallback');
          imgElement.style.display = 'block';
        }
      });
  }
}