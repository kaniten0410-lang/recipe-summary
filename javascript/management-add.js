/* -------------------------------------------------------------------------- */
/*                                    データ登録                               */
/* -------------------------------------------------------------------------- */
/**
 * ボタン押下後、データ登録を行う処理
 *
 * @return {*} 
 */
async function saveData() {
  // formの内容を全て取得
  const form = document.getElementById("addform");

  // 入力規則チェック
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // formDataに格納
  const formData = new FormData(form);
  const url_data = formData.get("url");

  if (url_data === "URL無し") {
    // URL無しの場合は料理名をタイトルに設定する
    const title = formData.get("name");
    formData.set("title", title);
  } else {
    // URLが既に登録されているのか確認
    const existing_url = allData.find((row) => row.url === url_data);
    if (existing_url) {
      alert("既に登録されているURLです!");
      return;
    }

    // GASに接続し、URLからタイトルを取得する
    try {
      const response = await fetch(
        `${gasUrl}?action=getTitle&url=${encodeURIComponent(url_data)}`,
      );
      const data = await response.json();

      formData.set("title", data.title);
    } catch (e) {
      alert("URLが上手く読み込めませんでした!");
      return;
    }
  }

  // 取得したものをobjectへ変換
  const data = Object.fromEntries(formData.entries());

  // true false取得処理
  const bool_categorys = ["isGohan", "isOkashi", "isTeiban"];
  for (const category of bool_categorys) {
    const [names, bools] = data[category].split("_");

    if (bools === "true") {
      data[category] = true;
    } else {
      data[category] = false;
    }
  }

  // firedateに登録
  try {
    if (confirm("登録しますか？")) {
      db.collection("recipes").add(data);
      alert("登録完了!");
      document.getElementById("addform").reset();
    } else {
      alert("登録しませんでした!");
    }
  } catch (e) {
    alert("エラー", e);
  }
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
