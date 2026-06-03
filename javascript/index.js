/* -------------------------------------------------------------------------- */
/*                                  画像取得処理                               */
/* -------------------------------------------------------------------------- */
// 画像をランダムで取得＆表示
const images = ["ebi2.png", "hamati.png", "hotate.png", "kani.png", "katuo.png", "maguro2.png", "sa-mon.png", "tai.png", "tamago.png"];
const random = images[Math.floor(Math.random() * images.length)];

// image-insertClassに画像情報を渡す
const elements = document.querySelectorAll('.image-insert');
for (const el of elements) {
  el.style.backgroundImage = `url(image/${random})`;
}

/* -------------------------------------------------------------------------- */
/*                       image-insertClassがclickされた時の処理              　*/
/* -------------------------------------------------------------------------- */
elements.forEach(element => {
  element.addEventListener('click', () => {
    // クリックした際に動いているのか確認
    // ページ読み込み初回は''（空文字）で入ってくるので、そこも対応
    const isRunning = element.style.animationPlayState == 'running'
      || element.style.animationPlayState === '';

    elements.forEach(e => {
      if (isRunning) {
        // 動いていたら止める
        e.style.animationPlayState = 'paused';
      } else {
        // 止まっていたら動かす
        e.style.animationPlayState = 'running';
      }
    });
  });
});