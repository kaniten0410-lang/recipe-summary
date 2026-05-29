// ジャンル項目からingredientSelectIDを取得する
const select = document.getElementById('title_Select');

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


document.getElementById("title_Select").addEventListener("change", function() {
  const titel_word = document.getElementById("title_Select").value;

  const selectedTitle = this.value;

  // allDataから該当データを検索
  const data = allData.find(row => row.title === selectedTitle);

  if (data) {
    // 各inputに値をセット
    const categorys = ["name", "tema", "genre", "memo"];
    for (const category of categorys) { 
      document.getElementById(category).value = data[category];
    };

    const bool_categorys = {"isGohan":"cook_", "isOkashi":"sweet_", "isTeiban":"teiban_"};
    Object.entries(bool_categorys).forEach (([key, value]) => { 

    let bool = "";
    if (data[key]) {
      bool = value + "true";
    } else {
      bool = value + "false";
    };
    document.getElementById(bool).click();
    });
  };
});

// プルダウンにタイトルを表示する
function title_load(filtered) {
  // プルダウンの内容を一旦指定なしだけにする（ご飯とお菓子を混在させないようにする）
  select.innerHTML = '<option value="all">↓ 検索結果 ↓</option>';

  // ジャンルの重複を除いてプルダウンに追加
  const titles = filtered.map(row => row.title);
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

async function searchClick(){
  const allData = await getData();
  //keywordを取得
  const keyword = document.getElementById("search").value;

  if (keyword === "") {
    select.innerHTML = '<option value="all">↓ 全件表示 ↓</option>';
    title_load(allData);
    return;
  }

  // フィルター処理
  const filtered = allData.filter(row => {
    // 料理名またはURLの欄が空欄であれば除外
    if (!row.title.includes(keyword)) return false;
    // 除外されていないデータを返す
    return true;
  });

  if (filtered.length === 0) {
    alert('条件に合うレシピが見つかりませんでした');
    return;
  }
  title_load(filtered);
};


function derete() {
  const form = document.getElementById("addform");
  const formData = new FormData(form);

  const titel = formData.get("titel");
  try {
    if (confirm("削除しますか？")) {
      db.collection("recipes")
        .where("url", "==", titel)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.ref.delete();
          });
          alert("削除完了!")
          document.getElementById("addform").reset();
        });
    } else {
      alert("削除しませんでした!")
    }
  } catch(e) {
    alert("エラー", e)
  };
};

function updata() {
  const form = document.getElementById("addform");

  // エラーチェック
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  const formData = new FormData(form);

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

  const titel = data["title"];

  console.log(data)

  try {
    if (confirm("更新しますか？")) {
      db.collection("recipes")
        .where("title", "==", titel)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            doc.ref.update(data);
          });
          alert("更新完了!")
          document.getElementById("addform").reset();
        });
    } else {
      alert("更新しませんでした!")
    }
  } catch(e) {
    alert("エラー", e)
  };
};