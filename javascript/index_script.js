const images = ["ebi2.png", "hamati.png", "hotate.png", "kani.png", "katuo.png", "maguro2.png", "sa-mon.png", "tai.png", "tamago.png"];
const random = images[Math.floor(Math.random() * images.length)];

const elements = document.getElementsByClassName("image-insert");
for (const el of elements) {
  el.style.backgroundImage = `url(../image/${random})`;
}

const eggs = document.querySelectorAll('.image-insert');
eggs.forEach(egg => {
  egg.addEventListener('click', () => {
    // クリックした際に動いているのか確認
    // ページ読み込み初回は''（空文字）で入ってくるので、そこも対応
    const isRunning = egg.style.animationPlayState == 'running'
                      || egg.style.animationPlayState === '';
    
  eggs.forEach(e => {
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