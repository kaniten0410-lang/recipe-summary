/* -------------------------------------------------------------------------- */
/*                                  ログイン確認                                */
/* -------------------------------------------------------------------------- */
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // ログイン済み → そのまま表示
    document.body.style.display = 'flex';
  } else {
    // 未ログイン → ログインページへ飛ばす
    window.location.href = '../HTML/login.html';
  }
});

/* -------------------------------------------------------------------------- */
/*                                ログアウト処理                               */
/* -------------------------------------------------------------------------- */
async function logout() {
  try {
    await firebase.auth().signOut();
    window.location.href = '../HTML/login.html';
  } catch (error) {
    alert('ログアウトに失敗しました: ' + error.message);
  }
}