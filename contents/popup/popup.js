const popmessage = document.getElementById("message");

function onExecuted(result) {
  popmessage.textContent = 'Valid Paperback. Executing...';
  browser.tabs.executeScript({
    file: '/../libdown.js'
  });
  browser.runtime.onMessage.addListener(handleMessage);
}

function handleMessage(message) {
  popmessage.textContent = message;
}

function onError(error) {
  popmessage.textContent = 'Not A Valid Paperback';
}

const makeItGreen = 'if(document.querySelector(\'#books-entity-teaser\') != null) {} else {throw error;}';
const executing = browser.tabs.executeScript({
  code: makeItGreen
}).then(onExecuted, onError);