/* -------------------------------------------------------------------------- */
/*                              全データテーブル表示                            */
/* -------------------------------------------------------------------------- */
/**
 *
 * テーブル表示処理
 * @param {Array<Object>} data
 */
function loadtable(data) {
  // recipeListIDを取得する
  const recipe_tbl = document.getElementById('recipeList');
  data.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML =`
        <td>${item.title}</td>
        <td>${item.name}</td>
        <td>${item.isGohan ? '1' : '0'}</td>
        <td>${item.isOkashi ? '1' : '0'}</td>
        <td><a href="${item.url}" target="_blank" rel="noopener noreferrer">リンク</a></td>
        <td>${item.tema}</td>
        <td>${item.isTeiban ? '1' : '0'}</td>
        <td>${item.genre}</td>
        <td>${item.memo}</td>
      `;
      recipe_tbl.appendChild(tr);
    });
  
  const number = document.getElementById("number");
  number.innerText = `全${data.length}件`;
  };

/* -------------------------------------------------------------------------- */
/*                                   初期化処理                                */
/* -------------------------------------------------------------------------- */
// allData取得＆テーブル表示
async function init() {
  const data = await getData();
  loadtable(data);
}

// ページ読み込み実行
init();