/* -------------------------------------------------------------------------- */
/*                                     変数                                   */
/* -------------------------------------------------------------------------- */
// menuFlagを取得
let menuFlag = document.getElementById("menuFlag").value;
// 手間Classを取得
const tema = document.querySelectorAll(".tema");

/* -------------------------------------------------------------------------- */
/*                                 チェックボックス処理                         */
/* -------------------------------------------------------------------------- */
// 手間チェックボックス全選択
function selectAllTema() {
  tema.forEach((cb) => (cb.checked = true));
}

// 手間チェックボックス選択全解除
function clearAllTema() {
  tema.forEach((cb) => (cb.checked = false));
}

/* -------------------------------------------------------------------------- */
/*                                 ごはん、お菓子ボタン                         */
/* -------------------------------------------------------------------------- */
function selectMenu(value, btn) {
  // 隠されている場所にあるinputのmenuFlagを取得し、受け取ったValueをセットする
  menuFlag = value;
  // menu-btnClassのものを全て取得し、acriveClassを除外
  document
    .querySelectorAll(".menu-btn")
    .forEach((b) => b.classList.remove("active"));
  // 選択した方にactiveClassを追加
  btn.classList.add("active");
  // プルダウン選択処理に入る
  loadIngredients(value);
}

/* -------------------------------------------------------------------------- */
/*                                  プルダウン表示処理                         */
/* -------------------------------------------------------------------------- */
function loadIngredients(menuFlag) {
  // ジャンル項目からingredientSelectIDを取得する
  const select = document.getElementById("ingredientSelect");
  // プルダウンの内容を一旦指定なしだけにする（ご飯とお菓子を混在させないようにする）
  select.innerHTML = '<option value="all">指定なし</option>';

  // isGohanかisOkashiでフィルター
  const filtered = allData.filter((row) => {
    if (menuFlag === "1") {
      return row.isGohan === true;
    } else if (menuFlag === "0") {
      return row.isOkashi === true;
    }
    return false;
  });

  // ジャンルの重複を除いてプルダウンに追加
  const genres = [
    ...new Set(filtered.map((row) => row.genre).filter(Boolean)),
  ].sort();
  genres.forEach((genre) => {
    // optionタグを作成する
    const option = document.createElement("option");
    // optionのvalueにジャンルを設定
    option.value = genre;
    // optionのtextにジャンルを設定
    option.innerText = genre;
    // ジャンル項目へ作成したoptionタグを追加する
    select.appendChild(option);
  });
}

/* -------------------------------------------------------------------------- */
/*                                    決定ボタン                               */
/* -------------------------------------------------------------------------- */
function submit() {
  // フラグがない場合はエラーを出力
  if (menuFlag === "") {
    showResult({ error: "ごはん・お菓子を選択してください" });
    return;
  }

  // 手間のチェックボックスにチェックされている内容を取得する
  const checkboxes = document.querySelectorAll("input[type=checkbox]:checked");
  // 取得した内容を配列に変換し、valueの内容を配列に入れる
  const selectedTema = Array.from(checkboxes).map((cb) => cb.value);
  // 配列が空ならエラーを出力
  if (selectedTema.length === 0) {
    showResult({ error: "手間を1つ以上選択してください" });
    return;
  }

  // 定番フラグの選択されている項目のvalueを取得
  const teibanFlag = document.querySelector("input[name=teiban]:checked").value;
  // カテゴリー項目のvalueを取得
  const ingredientFilter = document.getElementById("ingredientSelect").value;

  // フィルター処理
  const filtered = allData.filter((row) => {
    // 料理名またはURLの欄が空欄であれば除外
    if (!row.name || !row.url) return false;
    // ①ごはん・お菓子フラグ
    // menuFlag=1の時は料理フラグ、menuFlag0の時はお菓子フラグに0が入っているものを除外
    if (menuFlag === "1" && row.isGohan !== true) return false;
    if (menuFlag === "0" && row.isOkashi !== true) return false;
    // ②手間（複数選択）
    // HTMLから取得したデータに該当しないものを除外
    if (!selectedTema.includes(row.tema)) return false;
    // ③定番フラグ　'all'の場合は絞り込まない
    // teibanFlag=1の場合、定番フラグに0が入っているものを除外
    if (teibanFlag === "1" && row.isTeiban !== true) return false;
    // ④食材（指定なしの場合はスキップ）
    // 指定がある場合は、ジャンルに一致しないデータを除外
    if (ingredientFilter !== "all" && row.genre !== ingredientFilter)
      return false;
    // 除外されていないデータを返す
    return true;
  });

  // フィルターをかけた後の配列が0であればエラー出力
  if (filtered.length === 0) {
    showResult({ error: "条件に合うレシピが見つかりませんでした" });
    return;
  }

  // ランダムに1件取得
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  showResult({ name: random.name, site: random.title, url: random.url });
}

/* -------------------------------------------------------------------------- */
/*                                    結果表示                                 */
/* -------------------------------------------------------------------------- */
function showResult(result) {
  // resultIDを取得する
  const resultDiv = document.getElementById("result-menu");

  // エラーだった場合の処理
  if (result.error) {
    // 結果欄からvisibleClassを削除する
    resultDiv.classList.remove("visible");
    // 結果欄にエラーメッセージを出力する
    resultDiv.innerText = result.error;
    // none（非表示）のエラー欄を出現させる
    resultDiv.style.display = "block";
    // 処理終わり
    return;
  }

  // if文の前にletで宣言
  let menuname = "";
  if (menuFlag === "1") {
    menuname = "ご飯";
  } else if (menuFlag === "0") {
    menuname = "お菓子";
  }

  // HTMLを追加する
  resultDiv.classList.add("visible");
  resultDiv.innerHTML = `今日の${menuname}は「<strong>${result.name}</strong>」です！
     <br><br>${result.site}<br>
     <a href="${result.url}" target="_blank" rel="noopener noreferrer">${result.url}</a>
     <img id="ogpImage" src="" alt="画像" style="display:none;">`;

  // OGP画像取得処理
  const ogpImage = document.getElementById("ogpImage");
  get_ogp(result.url, ogpImage);
}

/* -------------------------------------------------------------------------- */
/*                                   初期化処理                                */
/* -------------------------------------------------------------------------- */
// allData取得（共通JSのallDataにデータをセットする）
async function init() {
  await getData();
}

// ページ読み込み実行
init();