const popmessage = document.body.children[1];

function onExecuted(result) {
  popmessage.textContent = 'Valid Paperback. Attempting To Download';
  browser.tabs.executeScript({
    file: "/../libdown.js"
  });
}

function onError(error) {
  popmessage.textContent = 'Not A Valid Paperback';
}

const makeItGreen = 'if(document.querySelector(\'#books-entity-teaser\') != null) {} else{throw error;}';
const executing = browser.tabs.executeScript({
  code: makeItGreen
}).then(onExecuted, onError);