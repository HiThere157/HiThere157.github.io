var libColor = {
  "p5.js": "#ed225d",
  "three.js": "#049EF4"
};

const openURI = (uri) => {
  if (uri.includes(".js")) {
    let tmpElement = document.createElement("script");
    tmpElement.src = uri;

    document.body.appendChild(tmpElement);
  } else {
    window.open(uri, "_blank").focus();
  }
};

const cardTemplate = document.getElementById("cardTemplate");
const mainContainer = document.getElementById("mainContainer");

fetch("./pages.json").then(response => response.json())
  .then(pages => pages.forEach(page => {
    var cardClone = cardTemplate.content.firstElementChild.cloneNode(true);
    var id = page.uri.split("/")[1]
    cardClone.style = `background-image: url(assets/${id}.webp)`;
    cardClone.querySelector(".cardTitle").innerText = page.title;
    cardClone.querySelector(".cardDescription").innerText = page.desc;

    cardClone.querySelector(".actionCode").onclick = () => { openURI("https://github.com/HiThere157/HiThere157.github.io/tree/main/" + id); };
    cardClone.querySelector(".actionOpen").onclick = () => { openURI(page.uri); };

    if (page.info) {
      cardClone.querySelector(".actionInfo").onclick = () => { openURI(page.info); };
    } else {
      cardClone.querySelector(".actionInfo").style = "opacity: 0.3; cursor: auto;";
    }

    if (page.lib) {
      cardClone.querySelector(".cardLibName").innerText = page.lib;
      cardClone.style.setProperty("--accent-color", libColor[page.lib]);
    } else {
      cardClone.querySelector(".cardLibContainer").style.display = "none";
    }

    cardClone.onclick = (event) => {
      console.log(event.target);
      if (event.target.className != "actionContainer" && event.target.tagName != "BUTTON") {
        openURI(page.uri);
      }
    }
    mainContainer.appendChild(cardClone);
  }));
