let isbook = false;
if (document.querySelector('#books-entity-teaser') != null)
  isbook = true;
if (isbook) {

  let author = document.querySelector(".contributorNameID").textContent;
  let title = document.querySelector("#productTitle").textContent;
  let publisher = document.querySelector("ul.a-spacing-none:nth-child(1) > li:nth-child(1) > span:nth-child(1) > span:nth-child(2)").textContent;
  let isbn10 = rmhy(document.querySelector("ul.a-spacing-none:nth-child(1) > li:nth-child(4) > span:nth-child(1) > span:nth-child(2)").textContent);
  let isbn13 = rmhy(document.querySelector("ul.a-spacing-none:nth-child(1) > li:nth-child(5) > span:nth-child(1) > span:nth-child(2)").textContent);
  console.log(isbn13, isbn10);
  const regex = /\d\d\d\d/;
  let year = publisher.match(regex).toString();
  console.log(parse(title));
  let url = 'http://libgen.rs/search.php?&req=' + parse(title) + '+' + parse(author) + '&column=def&sort=year&res=100';
  console.log(url);
  fetch(url).then(response => response.text()).then(function(html) {
    let parser = new DOMParser();
    let doc = parser.parseFromString(html, 'text/html');
    let array = Array.from(doc.querySelectorAll("table.c > tbody > tr"));
    array.shift();
    let results = search(year, author, publisher, isbn13, isbn10, array);
    let best = Array.from(results)[results.size - 1][0];
    var bestlink = best.children[9].firstElementChild.href;
    console.log(bestlink);
    return bestlink;

  }).then(function(url) {
    fetch(url).then(response => response.text()).then(function(html) {
      let parser = new DOMParser();
      let doc = parser.parseFromString(html, 'text/html');
      let link = doc.querySelectorAll('#download a')[2].href;
      downloadURI(link, 'hello');
    });
  });
  // fetch(bestlink).then(response => response.text()).then(function(html) {
  //   let parser = new DOMParser();
  //   let doc = parser.parseFromString(html, 'text/html');
  //   console.log(doc);
  // })
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
    } else if (title[count] == '(' || title[count] == ',') {
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

function search(year, author, publisher, isbn13, isbn10, array) {
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
        trscore += 20;
      }
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