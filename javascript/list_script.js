// 起動時
getData().then(data => {
  loadtable(data, 0);
});

// resultIDを取得する
const resultDiv = document.getElementById('result-list');

// データ取得し、テーブル表示させる
function loadtable(allData, option = 0) {
  // recipeListIDを取得する
  const recipe_tbl = document.getElementById('recipeList');

  // option==1(検索機能)の場合は一旦すべての要素を削除
  if (option == 1){
    resultDiv.style.display = 'none';
    
    while (recipe_tbl.firstChild) {
      recipe_tbl.removeChild(recipe_tbl.firstChild);
    }
  };

  // フィルター処理
  const filtered = allData.filter(row => {
    // 料理名またはURLの欄が空欄であれば除外
    if (row.url === 'URL無し') return false;
    // 除外されていないデータを返す
    return true;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 画面に表示されたら
        const img = entry.target;
        const url = img.dataset.url;
        const tai = "https://kaniten0410-lang.github.io/recipe-summary/tai.png";
        
        get_ogp(url, img, tai);
        
        // 一度取得したら監視をやめる
        observer.unobserve(img);
      }
    });
  });

  // フィルター処理後のデータを一つずつ取得
  filtered.forEach(item => {
    // trタグを作成
    const tr = document.createElement('tr')
    // trタグに情報追加
    tr.innerHTML =`
          <td><img src="" alt="" data-url="${item.url}"></td>
          <td><a href="${item.url}" target="_blank">${item.title}</td>`;

    // trタグ内のimgを取得
    const img = tr.querySelector('img');
    // Class追加
    img.classList.add('ogp-image');
    // imgを監視対象に追加
    observer.observe(img);
    // 作成した内容をテーブルに反映
    recipe_tbl.appendChild(tr);
    });
  };

// 結果表示
function showResult(result) {

  // エラーだった場合の処理
  if (result.error) {
    // 結果欄にエラーメッセージを出力する
    resultDiv.innerText = result.error;
    // none（非表示）のエラー欄を出現させる
    resultDiv.style.display = 'block';
    // 処理終わり
    return;
  }
};

// 検索機能
function searchClick(search){
  //keywordを取得
  const keyword = document.getElementById(search).value;

  if (keyword === "") {
    showResult({ error: '条件を入力してください' });
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
    showResult({ error: '条件に合うレシピが見つかりませんでした' });
    return;
  }
  // テーブルへ表示
  loadtable(filtered, 1);
}