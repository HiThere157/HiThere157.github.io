function makeTableHTML(Array) {
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

      result += "<td" + _add + ">" + tmp.toString() + "</td>";
    }
    result += "</tr>";
  }
  result += "</table>";
  return result;
}

function filterText(str) {
  let ret = decodeURI(str).trim();
  let filter = ["\r", "<", ">", '"'];

  filter.forEach(val => {
    ret = ret.replaceAll(val[0], "");
  });
  return ret;
}

function transpose(array) {
  let shape = [getLongestArray(array), array.length];
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

  let tmpR = "0" + newMins;
  return [hrs, tmpR.substr(tmpR.length - 2, 2)].join(":");
}

function getMinutes(time) {
  let tmp = time.split(":");
  let hrs = parseInt(tmp[0]);
  let min = parseInt(tmp[1]);

  return hrs * 60 + min;
}

function getLongestArray(array) {
  let lengths = array.map(val => val.length);
  return Math.max(...lengths);
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
};

function setBar() {
  var date = new Date();
  document.getElementById("header").innerText = "Date: " + [date.getDate(), date.getMonth() + 1, date.getFullYear()].join(".");

  let tableTop = getAbsoluteY(document.getElementById("R1"));
  let tableHeight = getAbsoluteY(document.getElementById("R" + times.length), true) - tableTop;

  let minsNow = getMinutes([date.getHours(), date.getMinutes()].join(":"));
  let minsMax = getMinutes(startEndTimes[startEndTimes.length - 1][1]);
  let minsMin = getMinutes(startEndTimes[0][0]);

  let perc = -1;
  if (minsNow <= minsMax && minsNow >= minsMin) {
    perc = (minsMax - minsMin) / (minsNow - minsMin);
  }
  document.documentElement.style.setProperty("--bar-height", tableHeight / perc + tableTop + "px");
}

var getParam = filterText(window.location.search.substr(1)).split("&");
if (getParam == "OF10S2") {
  getParam = "15,40,40,40,20,45,45,45,45,45,45,45&Testen,Englisch,IT-Systeme,IT-Systeme,Pause,IT-Technik,IT-Technik,AP,Mittagspause,Politik,AP,Ethik/Reli;;;Testen,BwP,BwP,Deutsch,Pause,Deutsch,IT-Technik,IT-Technik,Mittagspause,IT-Systeme,IT-Systeme;&pause&7:50".split("&");
}

var times = getParam[0].split(",").map(time => parseInt(time));
var schedule = getParam[1].split(";").map(day => day.split(","));
var breakName = getParam[2];
var startTime = getParam[3];

//calculate lesson times & make the html table
var startEndTimes = [["", startTime]];
for (let i = 0; i < times.length; i++) {
  startEndTimes.push([startEndTimes[i][1], addTimes(startEndTimes[i][1], times[i])]);
}
startEndTimes.shift();
schedule.unshift(startEndTimes.map(val => val.join(" - ")));
document.getElementById("main").innerHTML = makeTableHTML(transpose(schedule));

//scale td with lesson length
for (let i = 0; i < times.length; i++) {
  document.getElementById("R" + (i + 1)).style.height = 1.5 * times[i] / 15 + "em";
}

//set all break 'lessons' to a different color
for (let i = 1; i < schedule.length; i++) {
  for (let j = 0; j < schedule[i].length; j++) {
    let tmpElem = document.getElementById("R" + (j + 1)).getElementsByTagName("td")[i];
    if (schedule[i][j].toLowerCase().indexOf(breakName) != -1) {
      tmpElem.style.setProperty("--c", "#ff0");
    }
    if (j > 0) {
      if (schedule[i][j] == schedule[i][j - 1]) {
        tmpElem.style.setProperty("--w", "0");
        tmpElem.innerText = "";
        document.getElementById("R" + (j)).getElementsByTagName("td")[i].style.setProperty("--h", "110%");
      }
    }
  }
}

setBar();
setInterval(setBar, 1000 * 60);