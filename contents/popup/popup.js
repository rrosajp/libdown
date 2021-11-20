const popmessage = document.getElementById("message");
listenForClicks();

function onExecuted(result) {
  popmessage.textContent = 'Valid Paperback. Attempting To Download';
  browser.tabs.executeScript({
    file: "/../libdown.js"
  });
}

function onError(error) {
  popmessage.textContent = 'Not A Valid Paperback';
}

function listenForClicks() {
  document.addEventListener("click", (e) => {
    if (e.target.textContent == 'Preferences') {
      var openingPage = browser.runtime.openOptionsPage();
    }
  });
}

const makeItGreen = 'if(document.querySelector(\'#books-entity-teaser\') != null) {} else{throw error;}';
const executing = browser.tabs.executeScript({
  code: makeItGreen
}).then(onExecuted, onError);