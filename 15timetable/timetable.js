function makeTableHTML(Array, n) {
  let result = "<table>";
  for (let i = 0; i < Array.length; i++) {
    result += "<tr id=R" + i + ">";
    for (let j = 0; j < Array[i].length; j++) {
      let tmp = Array[i][j];
      if (tmp == undefined) {
        tmp = "";
      }

      let _add = "";
      if (i > 0 && j > 0 && tmp != "") {
        _add = " class=format"
      }
      let _nSpan = "";
      if (j == 0 && i > 0) {
        _nSpan = "<span class=mr>" + n[i - 1] + "</span>";
      }

      result += "<td" + _add + ">" + tmp.toString() + _nSpan + "</td>";
    }
    result += "</tr>";
  }
  result += "</table>";
  return result;
}

function transpose(array) {
  let shape = [times.length, array.length];
  let ret = [["Times", "Mon", "Tue", "Wed", "Thu", "Fri"]];

  for (let j = 0; j < shape[0]; j++) {
    let newRow = [];
    for (let i = 0; i < shape[1]; i++) {
      newRow.push(array[i][j]);
    }
    ret.push(newRow);
  }
  return ret;
}

function fillZero(str) {
  let tmp = "0" + str;
  return tmp.substr(tmp.length - 2, 2);
}

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

  return [hrs, fillZero(newMins)].join(":");
}

function getMinutes(time) {
  let tmp = time.split(":");
  let hrs = parseInt(tmp[0]);
  let min = parseInt(tmp[1]);

  return hrs * 60 + min;
}

function getAbsoluteY(element, addOwnHeight = false) {
  let top = 0;
  if (addOwnHeight == true) {
    top = element.offsetHeight;
  }

  do {
    top += element.offsetTop || 0;
    element = element.offsetParent;
  } while (element);
  return top;
}

function changeSlider(value) {
  let headerElem = document.getElementById("header");
  headerElem.innerHTML = "<span style='background-color: var(--pimary-background); border-radius: 3px'>" + value + "</span>";
  headerElem.style.height = "2em";
  headerElem.style.backgroundColor = "hsl(" + value + ", 100%, 40%)";
  headerElem.style.justifyContent = "space-around";
}

function addGet(param) {
  document.location.search = param;
}

var m = false;
function changeMode() {
  let btn = document.getElementById("lmDm_Btn");
  m = !m;
  if (m == true) {
    var _add = ["-lm", 0];
    btn.style.backgroundImage = "url(icons/moon_icon.svg)";
    document.documentElement.style.setProperty("--opacity", 0.35);
  } else {
    var _add = ["-dm", 1];
    document.documentElement.style.setProperty("--opacity", 0.2);
    btn.style.backgroundImage = "url(icons/sun_icon.svg)";
  }

  ["--pimary-background", "--secondary-background", "--font-color"].forEach(element => {
    document.documentElement.style.setProperty(element, getComputedStyle(document.body).getPropertyValue(element + _add[0]));
  });

  ["lmDm_Btn", "names_Btn"].forEach(element => {
    document.getElementById(element).style.filter = "invert(" + _add[1] + ")";
  });
}

var sn = true;
function showNames() {
  let btn = document.getElementById("names_Btn");
  sn = !sn;
  if (sn == true) {
    var _add = "block";
    btn.style.backgroundImage = "url(icons/eye_off_icon.svg)";
  } else {
    var _add = "none";
    btn.style.backgroundImage = "url(icons/eye_icon.svg)";
  }

  [...document.getElementsByClassName("br")].forEach(element => {
    element.style.display = _add;
  });
}

function setBar() {
  let date = new Date();
  let day = date.getDay();
  document.getElementById("date_span").innerText = "Date: " + [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(".");
  document.getElementById("time_span").innerText = "Time: " + [date.getHours(), fillZero(date.getMinutes())].join(":");

  document.getElementById("main").style.setProperty("--bar-width", getComputedStyle(document.getElementById("R0")).width);
  if (day > 0 && day < 6) {
    let activeElem = document.getElementById("R0").getElementsByTagName("td")[day];
    activeElem.style.setProperty("--c", "0");
    activeElem.style.zIndex = 2;
  }

  let tableTop = getAbsoluteY(document.getElementById("R1"));
  let tableHeight = getAbsoluteY(document.getElementById("R" + times.length), true) - tableTop;

  let minsNow = getMinutes(date.getHours() + ":" + date.getMinutes());
  // let minsNow = getMinutes("11:50");
  let minsMax = getMinutes(startEndTimes[startEndTimes.length - 1][1]);
  let minsMin = getMinutes(startEndTimes[0][0]);

  let perc = -1;
  if (minsNow <= minsMax && minsNow >= minsMin) {
    perc = (minsMax - minsMin) / (minsNow - minsMin);
  }
  document.documentElement.style.setProperty("--bar-height", tableHeight / perc + tableTop + "px");
}

var getParams = decodeURIComponent(window.location.search.substr(1)).replaceAll("<", "").replaceAll(">", "").split("?");
var getParam = getParams[0].split("&");
var saved = {
  //lesson length (delimited by ,) & Days/Lessons (delimited by ; and lessons by ,) & breaks & start time & Lessons with their color (delimited by , and :)
  "OF10S2": "15,40,40,40,20,45,45,45,45,45,45,45&Testen,Englisch,IT-Systeme,IT-Systeme,Pause,IT-Technik,IT-Technik,Mittagspause,AP,Politik,AP,Ethik/Reli;;;Testen,BwP,BwP,Deutsch,Pause,Deutsch,IT-Technik,IT-Technik,Mittagspause,IT-Systeme,IT-Systeme;&17&7:50&Pause:60,Mittagspause:60,Testen:40,Englisch:0:Fr. Klingspor,IT-Systeme:180:Hr. Elter,AP:130:Hr. Schmidt+Fr. Hippeli,Politik:200:Hr. Berberich,Ethik/Reli:300:Fr. Beckmann+Fr. Hoffmann,BwP:80:Hr. Geheeb,Deutsch:120:Hr. Foltin,IT-Technik:260:Hr. Geheeb (KL)+Hr. Zimmermann"
}
if (saved[getParam] != undefined) {
  document.title = getParam + " | Timetable";
  getParam = saved[getParam].split("&");

} else if (getParam == "") {
  let headerElem = document.getElementById("header");
  headerElem.innerHTML = Object.keys(saved).map(key => "<u onclick=addGet('" + key + "')>" + key + "</u>").join("");
  headerElem.style.height = "2em";
  headerElem.style.justifyContent = "space-around";

} else if (getParam == "Hue") {
  let slider = document.createElement("input");
  slider.type = "range";
  slider.min = 0;
  slider.max = 360;
  slider.step = 1;
  slider.value = 0;
  slider.style = "width: 100%;"
  slider.oninput = function () { changeSlider(this.value); };

  document.getElementById("main").appendChild(slider);
  changeSlider(0);
}

if (getParams[1] != undefined) {
  if (getParams[1].indexOf("h") != -1) {
    setTimeout(showNames, 0);
  }
  if (getParams[1].indexOf("l") != -1) {
    setTimeout(changeMode, 0);
  }
  if (getParams[1].indexOf("g") != -1) {
    setTimeout(function () {
      [...document.getElementById("R0").childNodes, ...document.getElementsByClassName("format"), document.getElementById("main")].forEach(element => {
        element.classList.add("neon");
      }, 0);
    })
  }
}

document.getElementById("lmDm_Btn").onclick = changeMode;
document.getElementById("names_Btn").onclick = showNames;

var times = getParam[0].split(",").map(time => parseInt(time));
var schedule = getParam[1].split(";").map(day => day.split(","));
var breaks = (parseInt(getParam[2]) >>> 0).toString(2).split("").reverse().join("");
var startTime = getParam[3];
params = [];
if (getParam[4] != undefined) {
  params = getParam[4].split(",").map(param => param.split(":"));
}

//calculate lesson times & make the html table
var nLesson = [];
for (let i = 0, t = 0; i < times.length; i++) {
  if (breaks[i] != "1") {
    t += 1;
    nLesson.push(t);
  } else {
    nLesson.push("");
  }
}
var startEndTimes = [["", startTime]];
for (let i = 0; i < times.length; i++) {
  startEndTimes.push([startEndTimes[i][1], addTimes(startEndTimes[i][1], times[i])]);
}
startEndTimes.shift();
schedule.unshift(startEndTimes.map(val => val.join(" - ")));
document.getElementById("main").innerHTML = makeTableHTML(transpose(schedule), nLesson);

//scale td with lesson length
for (let i = 0; i < times.length; i++) {
  document.getElementById("R" + (i + 1)).style.height = 1.5 * times[i] / 15 + "em";
}

//set all lessons to a different color & teacher
let colors = {};
let teachers = {};
params.forEach(param => {
  colors[param[0].toLowerCase()] = param[1];
  teachers[param[0].toLowerCase()] = param[2];
});
for (let i = 1; i < schedule.length; i++) {
  for (let j = 0; j < schedule[i].length; j++) {
    let tmpElem = document.getElementById("R" + (j + 1)).getElementsByTagName("td")[i];
    let tmp = schedule[i][j].toLowerCase();
    if (colors[tmp] != undefined) {
      tmpElem.style.setProperty("--c", colors[tmp]);
    }
    if (teachers[tmp] != undefined) {
      tmpElem.innerHTML += "<span class=br>" + teachers[tmp].replaceAll("+", "<br>") + "<span>";
    }

    if (j > 0) {
      if (tmp == schedule[i][j - 1].toLowerCase()) {
        tmpElem.style.setProperty("--w", "0");
        tmpElem.innerHTML = "";
        document.getElementById("R" + (j)).getElementsByTagName("td")[i].style.setProperty("--h", "110%");
      }
    }
  }
}

setBar();
window.onresize = setBar;
setInterval(setBar, 1000 * 5);