// 起動時
getData().then(data => {
  loadtable(data, 0);
});

// データ取得し、テーブル表示させる
function loadtable(allData) {
  // recipeListIDを取得する
  const recipe_tbl = document.getElementById('recipeList');
  allData.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML =`
        <tr>
          <td>${item.title}</td>
          <td>${item.name}</td>
          <td>${item.isGohan ? '1' : '0'}</td>
          <td>${item.isOkashi ? '1' : '0'}</td>
          <td><a href="${item.url}" target="_blank">リンク</td>
          <td>${item.tema}</td>
          <td>${item.isTeiban ? '1' : '0'}</td>
          <td>${item.genre}</td>
          <td>${item.memo}</td>
        </tr>
      `;
      recipe_tbl.appendChild(tr);
    });
  };