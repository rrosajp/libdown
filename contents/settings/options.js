function saveOptions(e) {
  e.preventDefault();
  browser.storage.sync.set({
    filetype: document.querySelector("#file-select").value
  });
  browser.storage.sync.set({
    lang: document.querySelector("#lang-select").value
  });
}

function restoreOptions() {

  function setCurrentFile(result) {
    document.querySelector("#file-select").value = result.filetype || "pdf";
  }

  function setCurrentLang(result) {
    document.querySelector("#lang-select").value = result.lang || "English";
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  let gettingfile = browser.storage.sync.get("filetype");
  gettingfile.then(setCurrentFile, onError);
  let gettinglang = browser.storage.sync.get("lang");
  gettinglang.then(setCurrentLang, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);