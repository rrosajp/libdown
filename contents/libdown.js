let detailsarray = Array.from(document.querySelector('#detailBulletsWrapper_feature_div').children[2].firstElementChild.children);
let author = document.querySelector(".contributorNameID").textContent.split(' ');
let pauthor = author[0] + " " + author[author.length - 1];
var title = document.querySelector("#productTitle").textContent;
var title = title.replace(/(\r\n|\n|\r)/gm, "");
for (var i = 0; i < detailsarray.length; i++) {
  let arr = (detailsarray[i].firstElementChild.innerText.split('  : '));
  switch (arr[0]) {
    case 'Publisher':
      var publisher = arr[1];
      const regex = /\d\d\d\d/;
      var year = publisher.match(regex).toString();
      break;
    case 'ISBN-10':
      var isbn10 = arr[1];
      break;
    case 'ISBN-13':
      var isbn13 = arr[1];
      break;
  }
}
let url = 'http://libgen.rs/search.php?&req=' + parse(title) + '+' + parse(pauthor) + '&column=def&sort=year&res=100';
fetch(url).then(response => response.text()).then(function(html) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  let array = Array.from(doc.querySelectorAll("table.c > tbody > tr"));
  return array;
}).then(function(array) {
  if (array.length != 1) {
    browser.runtime.sendMessage({
      message: 'Download found! :) Trying to download ...',
      url: url,
      label: 'Libgen'
    });
    array.shift();
    let results = search(year, pauthor, isbn13, isbn10, array);
    let best = Array.from(results)[results.size - 1][0];
    var bestlink = best.children[9].firstElementChild.href;
    fetch(bestlink).then(response => response.text()).then(function(html) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html, 'text/html');
      let link = doc.querySelectorAll('#download a')[2].href;
      browser.runtime.sendMessage({
        downurl: link,
        title: title
      });
    });
  } else {
    let url = 'http://libgen.rs/fiction/?q=' + parse(title) + '+' + parse(pauthor) + '&language=English';
    fetch(url).then(response => response.text()).then(function(html) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html, 'text/html');
      let array = Array.from(doc.querySelectorAll(".catalog tbody tr"));
      if (array == null) {
        browser.runtime.sendMessage({
          message: 'Download not found :('
        });
      } else {
        browser.runtime.sendMessage({
          message: 'Download found! :) Trying to download ...',
          url: url,
          label: 'LibgenFiction'
        });
      }
      let results = searchfiction(pauthor, array);
      let best = Array.from(results)[results.size - 1][0];
      var bestlink = best.children[5].firstElementChild.firstElementChild.firstElementChild.href;
      fetch(bestlink).then(response => response.text()).then(function(html) {
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let link = doc.querySelectorAll('#download a')[1].href;
        // browser.runtime.sendMessage({
        //   downurl: link,
        //   title: title
        // });
      });
    });
  }
});


// function downloadURI(uri, name) {
//   var link = document.createElement("a");
//   link.download = name;
//   link.href = uri;
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
//   delete link;
// }

function parse(title) {
  let length = title.length;
  let newtitle = "";
  for (let count = 0; count < title.length; count++) {
    if (title[count] == " ") {
      newtitle += "+";
    } else if (title[count] == '(' || title[count] == ',' || title[count] == ':') {
      if (title[count - 1] == ' ') {
        return newtitle.slice(0, -1);
      }
      return newtitle;
    } else {
      newtitle += title[count];
    }
  }
  return newtitle;
}

function search(year, pauthor, isbn13, isbn10, array) {
  const scoreboard = new Map();

  for (var i = 0; i < array.length; i++) {
    var tr = array[i];
    var trscore = 0;
    var splitauthor = pauthor.split(" ");
    var isbns = tr.children[2].lastElementChild.lastElementChild;
    if (isbns != null) {
      var isbnsplit = isbns.textContent.split(',');
      for (var j = 0; j < isbnsplit.length; j++) {
        if (rmhy(isbnsplit[j]) == isbn13 || rmhy(isbnsplit[j]) == isbn10) {
          trscore += 30;
          break;
        }
      }
    }
    if (tr.children[6] != null) {
      if (tr.children[6].innerText == 'English') {
        trscore += 100;
      }
    }
    if (tr.children[4] != null) {
      if (tr.children[4].innerText >= year) {
        trscore += 100;
      }
    }
    if (tr.children[1] != null) {
      if (tr.children[1].innerText.includes(splitauthor[0]) || tr.children[1].innerText.includes(splitauthor[splitauthor.length - 1])) {
        trscore += 100;
      }
    }
    if (tr.children[1] != null) {
      if (tr.children[8].innerText == 'pdf') {
        trscore += 30;
      }
    }
    scoreboard.set(tr, trscore);
  };
  var scoreboardAsc = new Map([...scoreboard.entries()].sort());
  return scoreboardAsc;
}

function searchfiction(pauthor, array) {
  const scoreboard = new Map();

  for (var i = 0; i < array.length; i++) {
    var tr = array[i];
    var trscore = 0;
    var splitauthor = pauthor.split(" ");
    if (tr.children[0] != null) {
      if (tr.children[1].innerText.includes(splitauthor[0]) || tr.children[1].innerText.includes(splitauthor[splitauthor.length - 1])) {
        trscore += 100;
      }
    }

    if (tr.children[4].innerText.split(' /')[0] == 'pdf') {
      trscore += 30;
    }

    scoreboard.set(tr, trscore);
  };
  var scoreboardAsc = new Map([...scoreboard.entries()].sort());
  return scoreboardAsc;
}



function rmhy(isbn) {
  let newisbn = '';
  for (let count = 0; count < isbn.length; count++) {
    if (isbn[count] != '-' && isbn[count] != ' ') {
      newisbn += isbn[count];
    }
  }
  return newisbn;
}