/* -------------------------------------------------------------------------- */
/*                                   変数　　　                                */
/* -------------------------------------------------------------------------- */
const resultDiv = document.getElementById("result-list");
const tai = "https://kaniten0410-lang.github.io/recipe-summary/image/tai.png";

/* -------------------------------------------------------------------------- */
/*                                   テーブル表示                              */
/* -------------------------------------------------------------------------- */
/**
 *　テーブル表示させるための処理
 *
 * @param {Array<Object>} data
 * @param {number} [option=0]
 * option=0 →初期表示
 * ontion=1 →検索後表示
 */
function loadtable(data, option = 0) {
  // recipeListIDを取得する
  const recipe_tbl = document.getElementById("recipeList");

  // option==1(検索機能)の場合は一旦すべての要素を削除
  if (option === 1) {
    resultDiv.style.display = "none";

    while (recipe_tbl.firstChild) {
      recipe_tbl.removeChild(recipe_tbl.firstChild);
    }
  }

  // URL無しのデータは表示させない
  const filtered = data.filter((row) => {
    if (row.url === "URL無し") return false;
    return true;
  });

  // フィルター処理後のデータを一つずつ取得
  filtered.forEach((item) => {
    // trタグを作成
    const tr = document.createElement("tr");
    // trタグに情報追加
    tr.innerHTML = `
          <td><img src="${item.imageURL === "" ? tai : item.imageURL }" alt="" class="${item.imageURL === "" ? "ogp-image ogp-fallback" : "ogp-image"}"></td>
          <td><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</td>`;

    // trタグ内のimgを取得
    const img = tr.querySelector("img");
    // 作成した内容をテーブルに反映
    recipe_tbl.appendChild(tr);
  });
}

/* -------------------------------------------------------------------------- */
/*                                    エラー表示                               */
/* -------------------------------------------------------------------------- */
/**
 * エラー表示処理
 *
 * @param {Object} result
 * @return {*}
 */
function showResult(result) {
  if (result.error) {
    resultDiv.innerText = result.error;
    resultDiv.style.display = "block";
    return;
  }
}

/* -------------------------------------------------------------------------- */
/*                                    検索ボタン                               */
/* -------------------------------------------------------------------------- */
/**
 * 検索ボタンを押したときの処理
 *
 * @return {*}
 */
function searchClick() {
  // allDataが読み込まれない場合、エラー出力
  if (!allData || allData.length === 0) {
    showResult({ error: "データの取得に失敗しました" });
    return;
  }
  // 検索ワードを取得
  const keyword = document.getElementById("search").value;

  // keywordが空ならエラー表示
  if (keyword === "") {
    showResult({ error: "条件を入力してください" });
    return;
  }

  // 検索ワードが含まれているものだけフィルター
  const filtered = allData.filter((row) => {
    if (row.url === "URL無し") return false;
    if (!row.title.includes(keyword)) return false;
    return true;
  });

  // 検索ワードが含まれるデータがなければエラー
  if (filtered.length === 0) {
    showResult({ error: "条件に合うレシピが見つかりませんでした" });
    return;
  }
  // テーブルへ表示
  loadtable(filtered, 1);
}

/* -------------------------------------------------------------------------- */
/*                                   初期化処理                                */
/* -------------------------------------------------------------------------- */
// allData取得＆レシピサイトテーブル表示
async function init() {
  try {
    const data = await getData();
    loadtable(data, 0);
  } catch(e) {
    console.error('Firebaseからのデータ取得に失敗しました', e);
    showResult({ error: "データの取得に失敗しました\n再度お試しください" });
  }
}

// ページ読み込み実行
init();
