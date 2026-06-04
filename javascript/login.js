firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // すでにログイン済みなら管理ページへ
    window.location.href = "../HTML/management.html";
  }
});

async function googleLogin() {
  try {
    // Firebase認証
    const provider = new firebase.auth.GoogleAuthProvider();
    // ポップアップでログイン画面を開く
    await firebase.auth().signInWithPopup(provider);
    window.location.href = "../HTML/management.html";
  } catch (error) {
    if (error.code === 'auth/network-request-failed') {
      alert('ネットワークエラーが発生しました\n接続を確認してください');
    } else {
      alert('ログインに失敗しました: ' + error.message);
    }
  }
}
