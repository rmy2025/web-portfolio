"use strict";

window.addEventListener("DOMContentLoaded",
  function () {

    if (typeof localStorage === "undefined") {
      Swal.fire({
        icon: 'error',
        text: 'このブラウザはLocal Storage機能が実装されていません'
      });
      return;
    } else {
      viewStorage();
      saveLocalStorage();
      delLocalStorage();
      delRowByIcon();
      selectTable();
      allClearLocalStorage();
    }

  }, false
);


function saveLocalStorage() {
  const save = document.getElementById("save");
  save.addEventListener("click",
    function (e) {
      e.preventDefault();
      const key = document.getElementById("textKey").value;
      const value = document.getElementById("textMemo").value;


      if (key === "" || value === "") {
        Swal.fire({
          title: 'Memo App',
          icon: 'warning',
          text: 'Key、Memoはいずれも必須です。'
        });
        return;

      } else {
        Swal.fire({
          title: 'Memo App',
          icon: 'question',
          text: "LocalStorageに「" + key + " " + value + "」を保存しますか？",
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'キャンセル'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.setItem(key, value);
            viewStorage();

            Swal.fire({
              title: 'Memo App',
              icon: 'success',
              text: "LocalStorageに「" + key + " " + value + "」を保存しました。",
              showConfirmButton: false,
              timer: 1500
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        });
      }
    }, false);
};


function delLocalStorage() {
  const del = document.getElementById("del");
  del.addEventListener("click",

    function (e) {
      e.preventDefault();
      const selectedData = selectCheckBox();
      const w_cnt = selectedData.count;
      const w_keys = selectedData.keys;

      if (w_cnt === 0) {
        Swal.fire({
          title: 'Memo App',
          icon: 'warning',
          text: "一つ以上選択してください"
        });
        return;
      } else if (w_cnt === 1) {
        const key = w_keys[0];
        const value = localStorage.getItem(key);

        Swal.fire({
          title: 'Memo App',
          icon: 'question',
          text: "LocalStorageから「" + key + " " + value + "」を削除しますか？",
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'キャンセル'
        }).then((result) => {
          if (result.isConfirmed) {
            localStorage.removeItem(key);
            viewStorage();

            Swal.fire({
              title: 'Memo App',
              icon: 'success',
              text: "LocalStorageから「" + key + " " + value + "」 を削除しました。",
              showConfirmButton: false,
              timer: 1500
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        });
      } else {

        Swal.fire({
          title: 'Memo App',
          icon: 'question',
          text: "LocalStorageから選択されている" + w_cnt + "件を削除しますか？",
          showCancelButton: true,
          confirmButtonText: 'OK',
          cancelButtonText: 'キャンセル'
        }).then((result) => {
          if (result.isConfirmed) {
            for (let i = 0; i < w_keys.length; i++) {
              localStorage.removeItem(w_keys[i]);
            }
            viewStorage();

            Swal.fire({
              title: 'Memo App',
              icon: 'success',
              text: "LocalStorageから" + w_cnt + "件を削除しました。",
              showConfirmButton: false,
              timer: 1500
            });

            document.getElementById("textKey").value = "";
            document.getElementById("textMemo").value = "";
          }
        });
      }
    }, false);
}



function selectTable() {
  const select = document.getElementById("select");
  select.addEventListener("click",
    function (e) {
      e.preventDefault();
      const selectedData = selectCheckBox(true);
      const w_cnt = selectedData.count;

      if (w_cnt === 1) {
        const w_key = selectedData.keys[0];
        document.getElementById("textKey").value = w_key;
        document.getElementById("textMemo").value = localStorage.getItem(w_key);
      } else {
        Swal.fire({
          title: 'Memo App',
          icon: 'warning',
          text: "一つ選択してください。"
        });
        document.getElementById("textKey").value = "";
        document.getElementById("textMemo").value = "";
      }
    }, false
  );
};


function selectCheckBox(isSelectButton = false) {
  const chkbox1 = document.getElementsByName("chkbox1");
  const table1 = document.getElementById("table1");
  let w_keys = [];

  for (let i = 0; i < chkbox1.length; i++) {
    if (chkbox1[i].checked) {
      const w_textKey = table1.rows[i + 1].cells[1].firstChild.data;
      w_keys.push(w_textKey);
    }
  }
  if (isSelectButton) {
    if (w_keys.length !== 1) {
    }
  }
  return {
    count: w_keys.length,
    keys: w_keys
  };
}



function viewStorage() {
  const list = document.getElementById("list");
  while (list.rows[0]) list.deleteRow(0);

  for (let i = 0; i < localStorage.length; i++) {
    let w_key = localStorage.key(i);

    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let td3 = document.createElement("td");
    let td4 = document.createElement("td");
    list.appendChild(tr);
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);

    td1.innerHTML = "<input name ='chkbox1' type='checkbox'>";
    td2.innerHTML = w_key;
    td3.innerHTML = localStorage.getItem(w_key);
    td4.innerHTML = '<img src="img/trash_icon.png" class="trash" alt="削除">';
  }
  $("#table1").tablesorter({
    sortList: [[1, 0]]
  });

  $("#table1").trigger("update");

};


function allClearLocalStorage() {
  const allClear = document.getElementById("allClear");
  allClear.addEventListener("click",
    function (e) {
      e.preventDefault();
      Swal.fire({
        title: 'Memo App',
        icon: 'warning',
        text: "LocalStorageのデータを全て削除します。\nよろしいですか？",
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'キャンセル'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.clear();
          viewStorage();

          Swal.fire({
            title: 'Memo App',
            icon: 'success',
            text: "LocalStorageのデータを全て削除しました。",
            showConfirmButton: false,
            timer: 1500
          });

          document.getElementById("textKey").value = "";
          document.getElementById("textMemo").value = "";
        }
      });
    }, false
  );
}



function delRowByIcon() {
  const table1 = document.getElementById("table1");
  table1.addEventListener("click", function (e) {
    if (e.target.classList.contains("trash")) {
      let tr = e.target.parentNode.parentNode;
      const key = tr.cells[1].textContent;
      const value = localStorage.getItem(key);
      Swal.fire({
        title: 'Memo App',
        icon: 'question',
        text: "LocalStorageから「" + key + " " + value + "」を削除しますか？",
        showCancelButton: true,
        confirmButtonText: 'OK',
        cancelButtonText: 'キャンセル'
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.removeItem(key);
          viewStorage();
          Swal.fire({
            title: 'Memo App',
            icon: 'success',
            text: "LocalStorageから「" + key + " " + value + "」 を削除しました。",
            showConfirmButton: false,
            timer: 1500
          });
        }
      });
    }
  }, false);
}

