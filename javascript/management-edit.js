/* -------------------------------------------------------------------------- */
/*                                     変数                                    */
/* -------------------------------------------------------------------------- */
// ジャンル項目からingredientSelectIDを取得する
const select = document.getElementById("title_Select");
// フォーム取得
const form = document.getElementById("addform");

/* -------------------------------------------------------------------------- */
/*                           既存データ内容表示処理                             */
/* -------------------------------------------------------------------------- */
select.addEventListener("change", function () {
  // タイトル名取得
  const selectedTitle = this.value;

  // allDataから該当データを検索
  const data = allData.find((row) => row.title === selectedTitle);

  // データがある場合、各項目にデータ表示
  if (data) {
    const categorys = ["name", "tema", "genre", "memo"];
    for (const category of categorys) {
      document.getElementById(category).value = data[category];
    }
    // ボタンも併せて変更
    const bool_categorys = {
      isGohan: "cook_",
      isOkashi: "sweet_",
      isTeiban: "teiban_",
    };
    Object.entries(bool_categorys).forEach(([key, value]) => {
      let bool = "";
      // 現在の値がtrueならボタンをtrue、falseならfalseに設定しクリック
      // クリックを行うことで色が付く
      if (data[key]) {
        bool = value + "true";
      } else {
        bool = value + "false";
      }
      document.getElementById(bool).click();
    });
  }
});


/* -------------------------------------------------------------------------- */
/*                           プルダウンにタイトルを表示させる                    */
/* -------------------------------------------------------------------------- */
/**
 * 検索処理後の処理
 *
 * @param {Array<Object>} data
 */
function title_load(data) {
  // 検索完了したらプルダウンの文言を変更する
  select.innerHTML = '<option value="all">↓ 検索結果 ↓</option>';

  // dataからタイトルのデータだけを取得
  const titles = data.map((row) => row.title);
  // タイトルを一つずつループ
  titles.forEach((title) => {
    // optionタグを作成する
    const option = document.createElement("option");
    // optionのvalueにタイトルを設定
    option.value = title;
    // optionのtextにもタイトルを設定
    option.innerText = title;
    // ジャンル項目へ作成したoptionタグを追加する
    select.appendChild(option);
  });
}

/* -------------------------------------------------------------------------- */
/*                                    検索処理                                 */
/* -------------------------------------------------------------------------- */
/**
 *　検索ボタンを押したときの処理
 *
 * @return {void} 
 */
function searchClick() {
  // allDataが読み込まれない場合、エラー出力
  if (!allData || allData.length === 0) {
    alert("データの取得に失敗しました");
    return;
  }

  //keywordを取得
  const keyword = document.getElementById("search").value;

  // keywordが含まれるタイトルをフィルター（空欄の場合はすべて取得）
  const filtered = allData.filter((row) => {
    if (!row.title.includes(keyword)) return false;
    return true;
  });

  // 一件もなければエラー
  if (filtered.length === 0) {
    alert("条件に合うレシピが見つかりませんでした");
    return;
  }
  // フィルターしたものをプルダウン表示
  title_load(filtered);
}

/* -------------------------------------------------------------------------- */
/*                            更新・削除完了後処理                              */
/* -------------------------------------------------------------------------- */
async function Initialization() {
    allData = null;
    await init();
    select.innerHTML = '<option value="all">検索してください</option>';
}

/* -------------------------------------------------------------------------- */
/*                                     削除                                    */
/* -------------------------------------------------------------------------- */
async function delete_data() {
  // allDataが読み込まれない場合、エラー出力
  if (!allData || allData.length === 0) {
    alert("データの取得に失敗しました");
    return;
  }
  
  // フォームデータ取得
  const formData = new FormData(form);
  // タイトル取得
  const title = formData.get("title");
  
  // タイトルをキーに削除処理
  try {
    if (confirm("削除しますか？")) {
      const snapshot = await db.collection("recipes")
        .where("title", "==", title)
        .get();

      for (const doc of snapshot.docs) {
        await doc.ref.delete();
      }
      alert("削除完了!");
      document.getElementById("addform").reset();
      Initialization();
    } else {
      alert("削除しませんでした!");
    }
  } catch (e) {
    if (e.code === "permission-denied") {
      alert("アクセス権限がありません");
    } else {
      console.error('データの削除に失敗しました', e);
      alert("データの削除に失敗しました");
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                     更新                                    */
/* -------------------------------------------------------------------------- */
async function updata() {
  // allDataが読み込まれない場合、エラー出力
  if (!allData || allData.length === 0) {
    alert("データの取得に失敗しました");
    return;
  }

  // フォーム入力規則チェック
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // データ取得
  const formData = new FormData(form);

  // 取得したものをobjectへ変換
  const data = Object.fromEntries(formData.entries());

  // true falseの取得
  const bool_categorys = ["isGohan", "isOkashi", "isTeiban"];
  for (const category of bool_categorys) {
    const [names, bools] = data[category].split("_");

    if (bools === "true") {
      data[category] = true;
    } else {
      data[category] = false;
    }
  }

  // タイトル取得
  const title = data["title"];

  // タイトルをキーに更新処理
  try {
    if (confirm("更新しますか？")) {
      const snapshot = await db.collection("recipes")
        .where("title", "==", title)
        .get();

      for (const doc of snapshot.docs) {
        await doc.ref.update(data);
      }
      alert("更新完了!");
      document.getElementById("addform").reset();
      Initialization();
    } else {
      alert("更新しませんでした!");
    }
  } catch (e) {
    if (e.code === "permission-denied") {
      alert("アクセス権限がありません");
    } else {
      console.error('データの更新に失敗しました', e);
      alert("データの更新に失敗しました");
    }
  }
}

/* -------------------------------------------------------------------------- */
/*                                   初期化処理                                */
/* -------------------------------------------------------------------------- */
// allData取得（共通JSのallDataにデータをセットする）
async function init() {
  try {
    allData = await getData();
  } catch(e) {
    console.error('Firebaseからのデータ取得に失敗しました', e);
    alert("データの取得に失敗しました\n再度お試しください");
  }
}

// ページ読み込み実行
init();
