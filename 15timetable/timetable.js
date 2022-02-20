//PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("worker.js");
};

window.addEventListener("beforeinstallprompt", (event) => {
  var installBtn = document.getElementById("installBtn");
  installBtn.style.display = "block";
  installBtn.onclick = () => { event.prompt(); }
});

const headerElement = document.getElementsByTagName("header")[0];
const footerElement = document.getElementsByTagName("footer")[0];
const mainElement = document.getElementById("main");

function filterUserInput(string) {
  return string.toString().replaceAll("<", "").replaceAll(">", "");
}

//make HTML table from array
function createHTMLTable(table, lessonLabels) {
  var result = "<table>";
  for (let i = 0; i < table.length; i++) {
    result += "<tr id=R" + i + ">";

    for (let j = 0; j < table[i].length; j++) {
      let currentField = filterUserInput(table[i][j] || "");
      let addFieldClass = (i > 0 && j > 0 && currentField != "") ? " class=format" : "";
      let fieldLabel = (j == 0 && i > 0) ? "<span class=lessonLabel>" + filterUserInput(lessonLabels[i - 1]) + "</span>" : "";

      result += "<td" + addFieldClass + ">" + currentField + fieldLabel + "</td>";
    }
    result += "</tr>";
  }

  result += "</table>";
  return result;
}

//transpose an array
function transpose2DArray(maxLength, array) {
  var result = [["Times", "Mon", "Tue", "Wed", "Thu", "Fri"]];

  for (let j = 0; j < maxLength; j++) {
    let newRow = [];
    for (let i = 0; i < array.length; i++) {
      newRow.push(array[i][j]);
    }
    result.push(newRow);
  }

  return result;
}

//add two HH:mm times
function addTimes(time, add) {
  let tmp = time.split(":");
  let hrs = parseInt(tmp[0]);
  let min = parseInt(tmp[1]);

  let newMins = min + add;

  if (newMins == 60) {
    newMins = 0;
    hrs += 1;
  } else if (newMins > 60) {
    newMins -= 60;
    hrs += 1;
  }

  return [hrs, newMins.toString().padStart(2, "0")].join(":");
}

//HH:mm to Minutes
function getMinutes(time) {
  let tmp = time.split(":");
  let hrs = parseInt(tmp[0]);
  let min = parseInt(tmp[1]);

  return hrs * 60 + min;
}

//absolute Y Position of an Element
function getAbsoluteY(element, addOwnHeight) {
  let top = 0;
  if (addOwnHeight) {
    top = element.offsetHeight;
  }

  do {
    top += element.offsetTop || 0;
    element = element.offsetParent;
  } while (element);
  return top;
}

function setURI(param) {
  document.location.search = param;
}

var intervalID;
class Timetable {
  constructor(uriStr) {
    const uri = uriStr.split("&");

    this.timeOverride;
    this.dayOverride;

    this.title = uri[0];

    try {
      this.timeTemplate = uri[1].split(",").map(time => parseInt(time));
      this.tableContent = uri[2].split(";").map(day => day.split(","));
      var breaks = (parseInt(uri[3]) >>> 0).toString(2).split("").reverse().join("");

      this.startTime = uri[4];

      //additional Info (background color, teacher name)
      var additionalInfo = [];
      if (uri[5]) {
        additionalInfo = uri[5].split(",").map(param => param.split(":"));
      }

      //dont label breaks
      this.lessonLabels = [];
      for (let i = 0, t = 0; i < this.timeTemplate.length; i++) {
        if (breaks[i] != "1") {
          t += 1;
          this.lessonLabels.push(t);
        } else {
          this.lessonLabels.push("");
        }
      }

      //calculate lesson start and end times using duration and end time of previous lesson
      this.startEndTimes = [["", this.startTime]];
      for (let i = 0; i < this.timeTemplate.length; i++) {
        this.startEndTimes.push(
          [this.startEndTimes[i][1], addTimes(this.startEndTimes[i][1], this.timeTemplate[i])]
        );
      }
      this.startEndTimes.shift();
      this.tableContent.unshift(this.startEndTimes.map(val => val.join(" - ")));

      //background colors and teacher info
      this.colors = {};
      this.teachers = {};
      additionalInfo.forEach(info => {
        this.colors[info[0].toLowerCase()] = info[1];
        this.teachers[info[0].toLowerCase()] = info[2];
      });

      localStorage.setItem(this.title, uriStr);
      this.setActiveTimetable();

    } catch {
      localStorage.removeItem(this.title);
      if (uriStr != "") {
        document.location.href = "./";
      }
    }

    console.log(this);
  }

  drawTimetable() {
    //scale td with lesson length and draw table
    mainElement.innerHTML = createHTMLTable(
      transpose2DArray(this.timeTemplate.length, this.tableContent), this.lessonLabels
    );
    for (let i = 0; i < this.timeTemplate.length; i++) {
      document.getElementById("R" + (i + 1)).style.height = 1.5 * this.timeTemplate[i] / 15 + "em";
    }

    //set all lessons to a different color & teacher
    for (let i = 1; i < this.tableContent.length; i++) {
      for (let j = 0; j < this.tableContent[i].length; j++) {

        let currentField = document.getElementById("R" + (j + 1)).getElementsByTagName("td")[i];
        let tmp = this.tableContent[i][j].toLowerCase();

        if (this.colors[tmp]) {
          currentField.style.setProperty("--c", this.colors[tmp]);
        }

        if (this.teachers[tmp]) {
          currentField.innerHTML += "<span class=nameSpan>" + filterUserInput(this.teachers[tmp]).replaceAll("+", "<br>") + "<span>";
        }

        //remove lesson name if is already labeld above
        if (j > 0 && tmp == this.tableContent[i][j - 1].toLowerCase()) {
          currentField.innerHTML = "";
          currentField.style.setProperty("--w", "0");
          document.getElementById("R" + (j)).getElementsByTagName("td")[i].style.setProperty("--h", "110%");
        }

      }
    }
    this.updateTimetable();
  }

  getLessonIndex(minutes) {
    for (let i = 0; i < this.startEndTimes.length; i++) {
      if (getMinutes(this.startEndTimes[i][0]) <= minutes && getMinutes(this.startEndTimes[i][1]) > minutes) {
        return i;
      }
    }
    return -1;
  }

  updateTimetable() {
    var date = new Date();
    var day = this.dayOverride || date.getDay();

    updateHeader(date);

    //calculate bar height
    mainElement.style.setProperty("--bar-width", getComputedStyle(document.getElementById("R0")).width);

    var tableTop = getAbsoluteY(document.getElementById("R1"), false);
    var tableHeight = getAbsoluteY(document.getElementById("R" + this.timeTemplate.length), true) - tableTop;

    var minsNow = getMinutes(this.timeOverride || date.getHours() + ":" + date.getMinutes());
    var minsMax = getMinutes(this.startEndTimes[this.startEndTimes.length - 1][1]);
    var minsMin = getMinutes(this.startEndTimes[0][0]);

    var perc = -1;
    if (minsNow <= minsMax && minsNow >= minsMin) {
      perc = (minsMax - minsMin) / (minsNow - minsMin);
    }
    document.documentElement.style.setProperty("--bar-height", tableHeight / perc + tableTop + "px");

    //progress bar footer
    var lessonIndex = this.getLessonIndex(minsNow);
    var lessonName;

    if (lessonIndex != -1 && day > 0 && day < 6) {
      let [startTime, endTime] = this.startEndTimes[lessonIndex];

      lessonName = this.tableContent[day][lessonIndex];
      let totalTime = this.timeTemplate[lessonIndex];

      //check for following lessons
      for (let i = lessonIndex + 1; i < this.startEndTimes.length; i++) {
        if (this.tableContent[day][i] != lessonName) {
          break;
        }
        endTime = this.startEndTimes[i][1];
        totalTime += this.timeTemplate[i];
      }

      //check for previous lessons
      for (let i = lessonIndex - 1; i >= 0; i--) {
        if (this.tableContent[day][i] != lessonName) {
          break;
        }
        startTime = this.startEndTimes[i][0];
        totalTime += this.timeTemplate[i];
      }

      document.getElementById("startTime").innerText = startTime;
      document.getElementById("endTime").innerText = endTime;
      let remainingTime = getMinutes(endTime) - minsNow;
      let footer_progBar = document.getElementById("footerBar");

      if (lessonName) {
        document.getElementById("progInfo").innerText = lessonName + " - " + remainingTime + " min. remaining"
        footer_progBar.style.width = (1 - remainingTime / totalTime) * 100 + "%";
        footer_progBar.style.setProperty("--c", this.colors[lessonName.toLowerCase()]);
      }
    }

    //hide footer if no lesson
    footerElement.style.display = lessonName ? "flex" : "none";
  }

  setActiveTimetable() {
    if (intervalID) {
      clearInterval(intervalID);
    }
    document.title = this.title + " | Timetable";
    this.drawTimetable();
    window.onresize = this.updateTimetable.bind(this);
    intervalID = setInterval(this.updateTimetable.bind(this), 1000);
  }
}

function updateHeader(date) {
  if (!date) {
    date = new Date();
  }

  document.getElementById("dateSpan").innerText = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(".");
  document.getElementById("timeSpan").innerText = [date.getHours(), date.getMinutes().toString().padStart(2, "0")].join(":");
}

function removeFromStorage(key) {
  localStorage.removeItem(key);
  location.reload();
}

//get current Get Parameter
const url = filterUserInput(decodeURIComponent(window.location.search.substring(1))).split("?");
var encodedData = url[0];
const staticTimetables = {
  //title & lesson length (delimited by ,) & Days/Lessons (delimited by ; and lessons by ,) & labels to skip & start time & Lessons with their color (delimited by , and :)
  "OF10S2": "OF10S2&15,40,40,40,20,45,45,45,45,45,45,45&Testen,Englisch,IT-Systeme,IT-Systeme,Pause,IT-Technik,IT-Technik,Mittagspause,AP,Politik,AP,Ethik/Reli;;;Testen,BwP,BwP,Deutsch,Pause,Deutsch,IT-Technik,IT-Technik,Mittagspause,IT-Systeme,IT-Systeme;&17&7:50&Pause:60,Mittagspause:60,Testen:40,Englisch:0:Fr. Klingspor,IT-Systeme:180:Hr. Elter,AP:130:Hr. Schmidt+Fr. Hippeli,Politik:200:Hr. Berberich,Ethik/Reli:300:Fr. Beckmann+Fr. Hoffmann,BwP:240:Hr. Geheeb,Deutsch:120:Hr. Foltin,IT-Technik:260:Hr. Geheeb (KL)+Hr. Zimmermann"
}
const savedTimetables = {
  ...Object.fromEntries(Object.entries(localStorage).filter(([key]) => key[0] != "_")),
  ...staticTimetables
}

//check for preProgrammed tables or special sites 
if (savedTimetables[encodedData]) {
  encodedData = savedTimetables[encodedData];

} else if (encodedData == "") {
  var buttonHtml = Object.keys(savedTimetables).map(key => {
    var filteredKey = filterUserInput(key);
    return `<div class="mainLinkContainer">
              <a href="?${filteredKey}">${filteredKey}</a>
              <button class="deleteBtn invert" 
                      onclick="removeFromStorage('${filteredKey}')" 
                      aria-label="remove ${filteredKey} from local storage" 
                      style="display: ${Object.keys(staticTimetables).includes(filteredKey) ? "none" : "block"};">
              </button>
            </div>`
  }).join("");

  mainElement.innerHTML = `<div class="mainLinks">
                            ${buttonHtml}
                          </div>
                          <div id="infoContainer">
                            <div id="infoIcon" class="invert"></div>
                            <span>
                              Open a valid Timetable Link once to add it to this List. (Data is saved to Browser Local Storage)
                            </span>
                          </div>`;

  updateHeader();
  intervalID = setInterval(updateHeader, 1000);
}

var mainTimetable = new Timetable(encodedData);

//check for last settings and apply them
if (localStorage.getItem("_lastNamesHidden") == "true") {
  setTimeout(toggleNames, 0);
}
if (localStorage.getItem("_lastLightMode") == "true") {
  setTimeout(changeMode, 0);
}

//toggle theme
var lightMode = false;
function changeMode() {
  lightMode = !lightMode;
  localStorage.setItem("_lastLightMode", lightMode);
  document.getElementById("modeBtn").style.backgroundImage = lightMode ? "url(icons/moon_icon.svg)" : "url(icons/sun_icon.svg)";
  document.documentElement.style.setProperty("--opacity", (lightMode ? 0.35 : 0.2));

  ["--pimary-background", "--secondary-background", "--font-color"].forEach(element => {
    document.documentElement.style.setProperty(element, getComputedStyle(document.body).getPropertyValue(element + (lightMode ? "-lm" : "-dm")));
  });
  [...document.getElementsByClassName("invert")].forEach(element => {
    element.style.filter = lightMode ? "invert(0)" : "invert(1)";
  });
}

//toggle teacher names
var hideNames = false;
function toggleNames() {
  hideNames = !hideNames;
  localStorage.setItem("_lastNamesHidden", hideNames);
  document.getElementById("namesBtn").style.backgroundImage = hideNames ? "url(icons/eye_icon.svg)" : "url(icons/eye_off_icon.svg)";
  [...document.getElementsByClassName("nameSpan")].forEach(element => {
    element.style.display = hideNames ? "none" : "block";
  });
}

//toggle progress bar visibility
var showFooter = true;
function toggleFooter() {
  showFooter = !showFooter;
  footerElement.classList = showFooter ? "footerOpen" : "footerClosed";
}

//set button handlers
document.getElementById("homeBtn").onclick = () => { document.location.href = "./"; };
document.getElementById("modeBtn").onclick = changeMode;
document.getElementById("namesBtn").onclick = toggleNames;
document.getElementById("openCloseFooter").onclick = toggleFooter;