var publicSpreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1w5QJOMfFR8G2clr4MD0WmyZbTvm6vXxSR2vTzalS6Ac/edit?usp=sharing';

function init() {
  Tabletop.init( { key: publicSpreadsheetUrl,
                   callback: showInfo,
                   simpleSheet: true } )
}

function showInfo(data, tabletop) {
  var songsToShow = data.slice(-5);
  var div = document.getElementById("songs");

  songsToShow.forEach(song => {
      var link = document.createElement("a");
      link.href = song.link;
      link.textContent = `${song.title} - ${song.artist}`;
      var li = document.createElement("li");
      li.appendChild(link);
      div.appendChild(li);
  });
}

window.addEventListener('DOMContentLoaded', init)