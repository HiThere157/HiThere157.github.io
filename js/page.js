var libColor = {
  "p5.js": "#ed225d",
  "three.js": "#049EF4",
  "matter.js": "#f19648"
};

const openURI = (uri, element = undefined) => {
  if (uri.includes(".js")) {
    let tmpElement = document.createElement("script");
    tmpElement.src = uri;

    document.body.appendChild(tmpElement);
  } else {
    window.open(uri, "_blank").focus();
  }

  if (element) {
    element.blur();
  }
};

const cardTemplate = document.getElementById("cardTemplate");
const mainContainer = document.getElementById("mainContainer");

fetch("./pages.json").then(response => response.json())
  .then(pages => pages.forEach((page, i) => {
    var cardClone = cardTemplate.content.firstElementChild.cloneNode(true);
    var id = page.uri.split("/")[1];

    if (page.noBg == true) {
      cardClone.style = "background-image: url(assets/icons/logo-github.svg); background-size: 50%; background-position: 50% 40%; backdrop-filter: blur( .05rem );";
    } else {
      cardClone.style = `background-image: url(assets/${id}.webp);`;
    }

    cardClone.querySelector(".cardTitle").innerText = page.title;
    cardClone.querySelector(".cardDescription").innerText = page.desc;

    cardClone.querySelector(".actionCode").onclick = (event) => { openURI("https://github.com/HiThere157/HiThere157.github.io/tree/main/" + id, event.target); };
    cardClone.querySelector(".actionOpen").onclick = (event) => { openURI(page.uri, event.target); };

    var actionInfoElement = cardClone.querySelector(".actionInfo");
    if (page.info) {
      actionInfoElement.onclick = (event) => { openURI(page.info, event.target); };
    } else {
      actionInfoElement.style = "opacity: 0.3; cursor: auto;";
      actionInfoElement.tabIndex = -1;
    }

    if (page.lib) {
      cardClone.querySelector(".cardLibName").innerText = page.lib;
      cardClone.style.setProperty("--accent-color", libColor[page.lib]);
    } else {
      cardClone.querySelector(".cardLibContainer").style.display = "none";
    }

    cardClone.onclick = (event) => {
      if (event.target.className != "actionContainer" && event.target.tagName != "BUTTON") {
        openURI(page.uri);
      }
    }
    mainContainer.appendChild(cardClone);
    setTimeout(() => {
      cardClone.classList.add("cardFadeIn");
      cardClone.style.opacity = 1;
    }, i*75);
  }));