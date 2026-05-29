// false選択処理
const false_button = document.querySelectorAll('[id$="_false"]');
false_button.forEach(b => b.classList.add('active'));

// ボタン処理
function selectMenu(flag, value) {
  // 隠されている場所にあるinputのmenuFlagを取得し、受け取ったValueをセットする
  document.getElementById(flag).value = value;
  // どのカテゴリなのかを取得
  const [category,bools] = value.split("_");

  // true,falseでactiveclassの切り替え
  if (value.includes("_true")) {
    // _falseのものを取得し、removeactiveする
    document.getElementById(category + "_false").classList.remove('active');
  } else if (value.includes("_false")) {
    document.getElementById(category + "_true").classList.remove('active');
  };
  // 選択した方にactiveClassを追加
  document.getElementById(value).classList.add('active');
}

// 決定ボタンが押された時の処理
async function saveData() {
  // formの内容取得
  const form = document.getElementById("addform");

  // エラーチェック
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // formDataに格納
  const formData = new FormData(form);
  const url_data = formData.get("url");

  const allData = await getData(); 
  const existing_url = allData.find(row => row.url === url_data);
  
  if (existing_url) {
    alert("既に登録されているURLです!");
    return;
  }

  // タイトル取得
  try {
    const gasUrl = 'https://script.google.com/macros/s/AKfycbxVmNg5RYgo7yKEcmJ9Q8SbYiONknuXKufVfM-Q67reNvjlZmyL6Wc0On8bLhCZyaQTNg/exec';
    const response = await fetch(`${gasUrl}?action=getTitle&url=${encodeURIComponent(url_data)}`);
    const data = await response.json();

    formData.set("title", data.title);

  } catch (e) {
    alert("URLが上手く読み込めませんでした!");
    return;
  };

  // 取得したものをobjectへ変換
  const data = Object.fromEntries(formData.entries());

  // true falseの設定
  const bool_categorys = ["isGohan", "isOkashi", "isTeiban"];
  for (const category of bool_categorys) { 
    const [names, bools] = data[category].split("_"); 

    if (bools === "true") {
      data[category] = true;
    } else {
      data[category] = false;
    };
  };

  // firedateに格納する
  try{
    if (confirm("登録しますか？")){
      db.collection('recipes').add(data);
      alert("登録完了!")
      document.getElementById("addform").reset();
    } else {
      alert("登録しませんでした!")
    }
  } catch(e) {
    alert("エラー", e)
  };
};