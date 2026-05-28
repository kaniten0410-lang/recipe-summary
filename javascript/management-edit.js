// 起動時
getData().then(data => {
  title_load(data);
});

// プルダウンにジャンルを表示する
function title_load(allData) {
  // ジャンル項目からingredientSelectIDを取得する
  const select = document.getElementById('title_Select');
  // プルダウンの内容を一旦指定なしだけにする（ご飯とお菓子を混在させないようにする）
  select.innerHTML = '<option value="all">指定なし</option>';

  // ジャンルの重複を除いてプルダウンに追加
  const titles = [...new Set(allData.map(row => row.title).filter(Boolean))].sort();
  titles.forEach(title => {
    // optionタグを作成する
    const option = document.createElement('option');
    // optionのvalueにジャンルを設定
    option.value = title;
    // optionのtextにジャンルを設定
    option.innerText = title;
    // ジャンル項目へ作成したoptionタグを追加する
    select.appendChild(option);
  });
};

function derete() {
  const form = document.getElementById("addform");
  const formData = new FormData(form);

  const url_data = formData.get("url");
  try {
    if (confirm("削除しますか？")) {
      db.collection("recipes")
        .where("url", "==", url_data)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.ref.delete();
          });
        });
      alert("削除完了!")
    } else {
      alert("削除しませんでした!")
    }
  } catch(e) {
    alert("エラー", e)
  };
};