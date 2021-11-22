<<<<<<< HEAD
var title;
var detailsarray;
var author;
var fictionarray = [];
if (document.querySelector('#detailBulletsWrapper_feature_div') != null) {
  var detailsarray = Array.from(document.querySelector('#detailBulletsWrapper_feature_div').children[2].firstElementChild.children);
}
if (document.querySelector(".contributorNameID") != null) {
  var author = document.querySelector(".contributorNameID").innerText;
}
var title = document.querySelector("#productTitle").innerText;
=======
let detailsarray = Array.from(document.querySelector('#detailBulletsWrapper_feature_div').children[2].firstElementChild.children);
let author = document.querySelector(".contributorNameID").textContent;
let title = document.querySelector("#productTitle").textContent;
for (var i = 0; i < detailsarray.length; i++) {
  let arr = (detailsarray[i].firstElementChild.innerText.split('  : '));
  switch (arr[0]) {
    case 'Publisher':
      var publisher = arr[1];
      break;
    case 'ISBN-10':
      var isbn10 = arr[1];
      break;
    case 'ISBN-13':
      var isbn13 = arr[1];
      break;
  }
}
const regex = /\d\d\d\d/;
let year = publisher.match(regex).toString();
console.log(parse(title));
let url = 'http://libgen.rs/search.php?&req=' + parse(title) + '+' + parse(author) + '&column=def&sort=year&res=100';
console.log(url);
fetch(url).then(response => response.text()).then(function(html) {
  let parser = new DOMParser();
  let doc = parser.parseFromString(html, 'text/html');
  let array = Array.from(doc.querySelectorAll("table.c > tbody > tr"));
  return array;
>>>>>>> parent of 5e3c876 (v1.3)

function onError(error) {
  console.log(`Error: ${error}`);
}

function onGotFiletype(item) {
  var filetype = "pdf";
  if (item.filetype) {
    var filetype = item.filetype;
  }
  return filetype;
}

function onGotLang(item) {
  var lang = "English";
  if (item.lang) {
    var lang = item.lang;
  }
  return lang;
}
asyncCall();
async function asyncCall() {
  const filetype = await browser.storage.sync.get("filetype").then(onGotFiletype, onError);
  const lang = await browser.storage.sync.get("lang").then(onGotLang, onError);
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
  if (author != null) {
    var nurl = 'http://libgen.rs/search.php?&req=' + parse(title) + '+' + parse(author) + '&column=def&sort=year&res=100';
    var furl = 'http://libgen.rs/fiction/?q=' + parse(title) + '+' + parse(author);
  } else {
    var nurl = 'http://libgen.rs/search.php?&req=' + parse(title) + '&column=def&sort=year&res=100';
    var furl = 'http://libgen.rs/fiction/?q=' + parse(title);
  }
  const bestnon = await fetch(nurl).then(response => response.text()).then(function(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    var array = Array.from(doc.querySelectorAll("table.c > tbody > tr"));
    return array;

  }).then(function(array) {
    array.shift();
    let results = search(year, author, isbn13, isbn10, array, filetype, lang);
    var best = Array.from(results)[results.size - 1];
    return best;
  });
  console.log(bestnon);
  console.log(nurl, furl)
  var link = await fetch(furl).then(response => response.text()).then(function(html) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html, 'text/html');
    console.log(doc);
    var fictionarray = Array.from(doc.querySelectorAll(".catalog tbody tr"));
    console.log(fictionarray);
    var fictionresults = searchfiction(author, fictionarray, filetype, lang);
    var bestfiction = Array.from(fictionresults)[fictionresults.size - 1];
    console.log(bestfiction.length);
    if (bestfiction != null && bestnon != null) {
      if (bestfiction[1] > bestnon[1]) {
        var bestlink = bestfiction[0].children[5].firstElementChild.firstElementChild.firstElementChild.href;
        console.log('fiction better');
      } else {
        console.log('nonfiction better');
        var bestlink = bestnon[0].children[9].firstElementChild.href;
      }
    } else if (bestfiction == null && bestnon != null) {
      var bestlink = bestnon[0].children[9].firstElementChild.href;
    } else if (bestfiction != null && bestnon == null) {
      var bestlink = bestfiction[0].children[5].firstElementChild.firstElementChild.firstElementChild.href;
      console.log('hello');
    } else {
      var bestlink = null;
    }
    console.log(bestlink);
    return bestlink;

  });
  fetch(link).then(response => response.text()).then(function(html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');
    let link = doc.querySelectorAll('#download a')[2].href;
    downloadURI(link, null);
  });

}

function downloadURI(uri, name) {
  var link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
}

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

function search(year, author, isbn13, isbn10, array, filetype, lang) {
  const scoreboard = new Map();

  for (var i = 0; i < array.length; i++) {
    var tr = array[i];
    var trscore = 0;
    var splitauthor = author.split(" ");
    var isbns = tr.children[2].lastElementChild.lastElementChild;
    if (isbns != null) {
      var isbnsplit = isbns.textContent.split(',');
      for (var j = 0; j < isbnsplit.length; j++) {
        if (rmhy(isbnsplit[j]) == isbn13 || rmhy(isbnsplit[j]) == isbn10) {
          trscore += 20;
          break;
        }
      }
    }
    if (tr.children[6] != null) {
      if (tr.children[6].innerText == lang) {
        trscore += 20;
      }
    }
    if (tr.children[4] != null) {
      if (tr.children[4].innerText >= year) {
        trscore += 20;
      }
    }
    if (tr.children[1] != null) {
      if (tr.children[1].innerText.includes(splitauthor[0]) || tr.children[1].innerText.includes(splitauthor[splitauthor.length - 1])) {
        trscore += 20;
      }
    }
    if (tr.children[1] != null) {
      if (tr.children[8].innerText == filetype) {
        trscore += 20;
      }
    }
    scoreboard.set(tr, trscore);
  };
  var scoreboardAsc = new Map([...scoreboard.entries()].sort());
  return scoreboardAsc;
}

function searchfiction(author, array, filetype, lang) {
  const scoreboard = new Map();

  for (var i = 0; i < array.length; i++) {
    var tr = array[i];
    var trscore = 0;
    var splitauthor = author.split(" ");
    if (tr.children[0] != null) {
      if (tr.children[1].innerText.includes(splitauthor[0]) || tr.children[1].innerText.includes(splitauthor[splitauthor.length - 1])) {
        trscore += 100 / 3;
      }
    }
    if (tr.children[3].innerText == lang) {
      trscore += 100 / 3;
    }
    if (tr.children[4].innerText.split(' /')[0] == filetype) {
      trscore += 100 / 3;
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