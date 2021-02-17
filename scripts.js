let index = 15;
let corsEndpoint = "https://cors-anywhere.herokuapp.com";
let superParent = document.getElementById("super-parent");
let msg = document.getElementById("indicator-msg");
let responseRender = document.getElementById("response");
//pagination
let paginationDiv = document.getElementById("pagination");
let searchInputBox = document.getElementById("searchQuery");
// loader spinner
let loader = document.getElementById("cover-spin");
// data source
let songsList = {};

async function searchInput() {
  let searchQuery = searchInputBox.value;

  loader.style.display = "block";
  fetch(`https://api.lyrics.ovh/suggest/${searchQuery}`)
    .then((res) => res.json())
    .then((result) => {
      loader.style.display = "none";
      // show pagination
      paginationDiv.classList.remove("d-none");
      //disable previous btn
      disableOrEnableBtn("prevBtn", true);

      songsList = result;
      //show list
      showSuggestions();
    })
    .catch((error) => console.log("error", error));
}

function nextCall(endpoint) {
  return `${corsEndpoint}/${endpoint}`;
}

async function showSuggestions() {
  //hide text if any
  if (msg) msg.style.display = "none";

  //hide list if any
  responseRender.innerHTML = "";

  let listContainer = document.createElement("ul");

  listContainer.style.listStyleType = "none";
  responseRender.appendChild(listContainer);

  songsList.data.map((item) => {
    //
    let listItem = document.createElement("li");
    let albumBlock = document.createElement("div");

    albumBlock.className = "album-block";

    let songName = document.createElement("h4");
    songName.innerHTML = item.title;

    listItem.className = "song-item";

    //artist
    let artistNameBlock = document.createElement("p");
    artistNameBlock.innerHTML = item.artist.name;

    //span
    let spanHiphen = document.createElement("span");
    spanHiphen.style.margin = "5px";
    spanHiphen.innerHTML = " - ";

    let lyricsBtn = document.createElement("button");
    lyricsBtn.innerHTML = "Show Lyrics";

    lyricsBtn.addEventListener("click", (e) => {
      //get artist & song name
      let artist = item.artist.name;
      let song = item.title;

      loader.style.display = "block";
      //call for lyrics
      fetch(`https://api.lyrics.ovh/v1/${artist}/${song}`)
        .then((res) => res.json())
        .then((result) => {
          loader.style.display = "none";
          //hide pagination
          paginationDiv.classList.add("d-none");
          //hiding album list
          listContainer.style.display = "none";

          //create lyrics block
          let lyricsBlock = document.createElement("div");
          lyricsBlock.className = "lyrics-block";
          //song name
          let h2 = document.createElement("h2");
          h2.innerHTML = song;
          //artist
          let p = document.createElement("p");
          p.className = "f-18";

          p.innerHTML = `(${artist})`;

          //lyrics
          let lyricsPara = document.createElement("p");
          lyricsPara.className = "lyrics";
          lyricsPara.innerHTML = result.lyrics;

          lyricsBlock.appendChild(h2);
          lyricsBlock.appendChild(p);
          lyricsBlock.appendChild(lyricsPara);

          responseRender.appendChild(lyricsBlock);
        })
        .catch((error) => console.log("error", error));
    });

    albumBlock.appendChild(songName);
    albumBlock.appendChild(spanHiphen);
    albumBlock.appendChild(artistNameBlock);
    listItem.appendChild(albumBlock);
    listItem.appendChild(lyricsBtn);
    listContainer.appendChild(listItem);
  });
}

async function loadNextPage() {
  //load next page
  let nextEndpointUrl = nextCall(songsList.next);
  var myHeaders = new Headers();
  myHeaders.append("X-Requested-With", "XMLHttpRequest");
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  loader.style.display = "block";
  fetch(nextEndpointUrl, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      loader.style.display = "none";
      if (result.prev) {
        //enable previous btn
        disableOrEnableBtn("prevBtn", false);
      }
      if (!result.next) {
        //enable previous btn
        disableOrEnableBtn("nextBtn", true);
      }

      songsList = result;
      showSuggestions();
    })
    .catch((error) => console.log("error", error));
}

async function loadPrevPage() {
  //load prev page
  let nextEndpointUrl = nextCall(songsList.prev);
  var myHeaders = new Headers();
  myHeaders.append("X-Requested-With", "XMLHttpRequest");
  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  loader.style.display = "block";
  fetch(nextEndpointUrl, requestOptions)
    .then((response) => response.json())
    .then((result) => {
      loader.style.display = "none";
      if (!result.prev) {
        //enable previous btn
        disableOrEnableBtn("prevBtn", true);
      }

      songsList = result;
      showSuggestions();
    })
    .catch((error) => console.log("error", error));
}

function disableOrEnableBtn(id, state) {
  // disable or enable
  document.getElementById(id).disabled = state;
}
