/* -------------------------------------------------------------------------- */
/*                                   OGP画像取得                               */
/* -------------------------------------------------------------------------- */
/**
 * fallbackをまとめて追加する関数
 * @param {HTMLImageElement} imgElement
 * @param {string|null} fallbackUrl
 */
function setFallback(imgElement, fallbackUrl) {
  imgElement.src = fallbackUrl;
  imgElement.classList.add('ogp-fallback');
}

/**
 * GAS経由でOGP画像を取得する処理
 *
 * @param {string} url
 * @param {HTMLImageElement} imgElement
 * @param {string|null} [fallbackUrl=null]
 */
async function get_ogp(url, imgElement, fallbackUrl = null) {
  // URLがない場合は処理を行わない
  if (url && url !== 'URL無し') {
    try {
      // GASに接続し、返事を待つ
      const res = await fetch(`${gasUrl}?url=${encodeURIComponent(url)}`);
      const ogp = await res.json();
      if (ogp.success) {
        // successならsrcに取得してきたURLを入れる
        imgElement.src = ogp.imageUrl;
      } else {
        // 失敗した場合はfallbackを入れる
        setFallback(imgElement, fallbackUrl);
      }
    } catch {
      // GAS接続等すべて失敗した場合もfallbackを入れる
      setFallback(imgElement, fallbackUrl);
    }
    // 成功しても失敗しても画面表示
    imgElement.style.display = 'block';
  }
}