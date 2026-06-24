/* -------------------------------------------------------------------------- */
/*                                  追加・編集共通処理                          */
/* -------------------------------------------------------------------------- */
// ページ読み込み時false選択処理
const false_button = document.querySelectorAll('[id$="_false"]');
false_button.forEach((b) => b.classList.add("active"));

/**
 * 各項目のボタンの処理
 *
 * @param {string} flag　最終データ格納ID名
 * @param {string} value　ボタンID名
 */
function selectMenu(flag, value) {
  // 隠されている場所にあるinputのmenuFlagを取得し、受け取ったValueをセットする
  document.getElementById(flag).value = value;
  // どのカテゴリなのかを取得
  const [category, bools] = value.split("_");

  // true,falseでactiveclassの切り替え
  if (value.includes("_true")) {
    // _falseのものを取得し、removeactiveする
    document.getElementById(category + "_false").classList.remove("active");
  } else if (value.includes("_false")) {
    document.getElementById(category + "_true").classList.remove("active");
  }
  // 選択した方にactiveClassを追加
  document.getElementById(value).classList.add("active");
}


/**
 *　各項目のボタンのリセット処理
 *
 */
function resetButtons() {
  // 一旦false_buttonを取得
  false_button.forEach((b) => {
    // idを取得
    const [category, bools] = b.id.split("_");
    // falseボタンにactiveを追加
    b.classList.add("active");

    // trueボタンからactiveを削除
    const trueButton = document.getElementById(category + "_true");
    if (trueButton) {
      trueButton.classList.remove("active");
    }
  });
}