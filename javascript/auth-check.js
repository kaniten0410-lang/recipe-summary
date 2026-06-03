firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // ログイン済み → そのまま表示
    document.body.style.display = 'flex';
  } else {
    // 未ログイン → ログインページへ飛ばす
    window.location.href = '../HTML/login.html';
  }
});