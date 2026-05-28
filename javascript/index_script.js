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