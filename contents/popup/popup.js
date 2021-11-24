const popmessage = document.getElementById("message");
const button = document.getElementById("button");

function onExecuted(result) {
  popmessage.textContent = 'Valid Paperback. Executing...';
  browser.tabs.executeScript({
    file: '/../libdown.js'
  });
  browser.runtime.onMessage.addListener(handleMessage);
}

function handleMessage(message) {
  if (message.message != null) {
    popmessage.textContent = message.message;
  }
  if (message.label != null) {
    button.innerText = message.label;
    button.onclick = function() {
      browser.tabs.create({
        url: message.url
      });
    }
    button.style.display = "block";
  }
  if (message.downurl != null) {
    // browser.downloads.download({
    //   url: message.downurl,
    //   filename: message.title
    // });
    browser.tabs.create({
      url: message.downurl
    });
  }
}

function onError(error) {
  popmessage.textContent = 'Not A Valid Paperback';
}

const makeItGreen = 'if(document.querySelector(\'#books-entity-teaser\') != null) {} else {throw error;}';
const executing = browser.tabs.executeScript({
  code: makeItGreen
}).then(onExecuted, onError);