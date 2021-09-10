function setupHTML() {
  document.getElementsByName("table_header").forEach(element => {
    let id = element.id[element.id.length - 1];

    for (let n = 1; n < 6; n++) {
      let select = document.createElement("select");
      select.setAttribute("name", "column_dropdown" + id.toString());
      select.onchange = function () { dropdownChange(this); };
      select.className = "data_select";

      let span = document.createElement("span");
      span.innerText = "C" + n.toString() + ":";

      element.appendChild(span);
      element.appendChild(select);
    }
  });

  document.getElementsByName("graph_header").forEach(element => {
    let id = element.id[element.id.length - 1];

    let dlButton = document.createElement("button");
    let icon = document.createElement("div");
    icon.className = "icon_div save_div";
    dlButton.appendChild(icon)
    dlButton.id = "dlBtn" + id.toString();
    dlButton.onclick = function () { downloadChartBtn(this); };

    let scaleLabel = document.createElement("label");
    scaleLabel.id = "setScaleLabel" + id.toString();
    scaleLabel.innerText = "Log Scale";
    scaleLabel.setAttribute("for", "setScale" + id.toString());

    let scaleInput = document.createElement("input");
    scaleInput.type = "checkbox";
    scaleInput.setAttribute("name", "setScale");
    scaleInput.id = "setScale" + id.toString();
    scaleInput.onchange = function () { dropdownChange(this, false); };

    element.appendChild(dlButton);
    element.appendChild(scaleLabel);
    element.appendChild(scaleInput);

    let axis_ = ["x", "y", "mod"];
    axis_.forEach(axis => {
      let select = document.createElement("select");
      select.setAttribute("name", axis + "Axis_dropdown");
      select.id = axis + "Axis_dropdown" + id.toString();
      select.onchange = function () { dropdownChange(this); };
      select.className = "data_select";

      let span = document.createElement("span");
      span.id = axis + "-Axis" + id.toString();
      span.innerText = axis + "-Axis:";

      element.appendChild(span);
      element.appendChild(select);
    });
  });

  document.getElementsByName("bottom_item_header").forEach(element => {
    let id = element.id[element.id.length - 1];

    let select = document.createElement("select");
    select.setAttribute("name", "bottom_dropdown");
    select.id = "bottom_dropdown" + id.toString();
    select.onchange = function () { dropdownChange(this); };

    element.appendChild(select);
  });

  for (let i = 0; i < 4; i++) {
    setSlider(i);
  }
}
setupHTML();

//sets slider value and updates input values
var sliders = { 0: [0, 1], 1: [0, 1], 2: [0, 1], 3: [0, 1] };
function setSlider(id) {
  $(function () {
    $("#slider-range" + id).slider({
      range: true,
      min: 0,
      max: sliders[id][1],
      values: sliders[id],
      slide: function (event, ui) {
        updateSlider(id, ui.values);
      }
    });

    for (let i = 0; i < 2; i++) {
      document.getElementById(i + "xRange" + id).value = sliders[id][i];
    }

  });
}

//on slider/input change; updates slider & simulates dropdown change
function updateSlider(id, vals) {
  let getVals = false;
  if (vals.length == 0) {
    getVals = true;
  }

  for (let i = 0; i < 2; i++) {
    if (getVals == true) {
      vals.push(Number(document.getElementById(i + "xRange" + id).value));
    } else {
      document.getElementById(i + "xRange" + id).value = vals[i];
    }
  }

  sliders[id] = [vals[0], vals[1]];
  if (getVals == true) {
    setSlider(id);
  }
  dropdownChange(document.getElementById("yAxis_dropdown" + id), true, false);
}

var edits = { 0: [0, 0, 0, 0, 0], 1: [0, 0, 0, 0, 0], 2: [0, 0, 0, 0, 0], 3: [0, 0, 0, 0, 0] };
function makeTableHTML(Array, buttons = false, id = "") {
  if (Array != null) {
    let result = "<table>";
    for (let i = 0; i < Array.length; i++) {
      if (i == 0) {
        result += "<thead>";
      } else if (i == 1) {
        result += "<tbody>";
      }

      result += "<tr>";
      for (let j = 0; j < Array[i].length; j++) {
        let tmp = Array[i][j];
        let htmlButton = "<div class='editButtons_container'><button id='e" + i + "," + j + "' class='icon_container' onclick='editValue(this)'><div class='icon_div edit_div'></div></button><button id='d" + i + "," + j + "' class='icon_container' onclick='editValue(this)'><div class='icon_div trash_div'></div></button><button id='i" + i + "," + j + "' class='icon_container' onclick='editValue(this)'><div class='icon_div plus_div'></div></button></div>"
        if (tmp == undefined) {
          tmp = "";
        }

        if (tmp.toString() != "" && i >= 1 && j >= 1 && buttons == true && edits[id][j - 1] == 1) {
          result += "<td><div class='flexClass editIcons'>" + tmp.toString() + htmlButton + "</div>";
        } else {
          result += "<td>" + tmp.toString();
        }

        result += "</td>";
      }
      result += "</tr>";

      if (i == 0) {
        result += "</thead>";
      } else if (i == Array.length - 1) {
        result += "</tbody>";
      }

    }
    result += "</table>";

    return result;

  } else {
    return "";
  }
}

//remove all Options from an 'select' element
function removeAllOptions(element) {
  while (element.options.length > 0) {
    element.remove(0);
  }
}

//sets dropdown options for an 'select' element
function setupDropdown(name, options, append = 0, remove = false, mod = true) {
  let s = false;
  if (name == "yAxis_dropdown" || name.substring(0, name.length - 1) == "column_dropdown" || name == "module_I" || name == "modAxis_dropdown" || name == "molule_Idataset") {
    options.unshift("-Select-");
    s = true;
  } else if (name == "xAxis_dropdown" || name == "module_Ix") {
    options.unshift("N");
    s = true;
  }

  let elements = document.getElementsByName(name);
  elements.forEach(element => {
    let options_;

    if (append != 0 && name != "top_dropdown" && name != "bottom_dropdown") {
      options_ = options.slice(options.length - append);
    } else {
      if (remove == false) {
        removeAllOptions(element);

        if (name == "bottom_dropdown" && append == 0) {
          options_ = options[element.id[element.id.length - 1]];
        } else {
          options_ = options;
        }
      } else {
        for (let i = 0; i < element.options.length; i++) {
          if (options.includes(element.options[i].text) == false) {
            element.remove(i);
            break;
          }
        }
      }
    }

    if (remove == false) {
      options_.forEach(option => {
        if (option != null && mod == true) {
          let opt = document.createElement("option");
          opt.text = option;
          element.add(opt);
        }
      });
    }
  });

  if (s == true) {
    options.shift();
  }
}
setupDropdown("top_dropdown", ["-Select-", "Graph", "Scatter", "Pie Chart", "Table", "Overview"]);
setupDropdown("bottom_dropdown", [["-Select-", "Min Max", "Delta", "Abs", "Gaussian Average", "Index"], ["-Select-", "Log", "Exp", "Root", "Add/Sub", "Mul", "Div", "Pow"], ["-Select-", "n-Fit", "xFlip", "Cut"], ["-Select-", "Calculator", "Function Gen", "Noise Gen", "Downloads", "Misc"]]);
setupDropdown("fGen_types", ["-Select-", "Linear", "Poly", "Exp", "Log", "Sin", "Cos", "Tan"]);

//contains 3 google Chart charts; sets data for chart
class Chart {
  constructor(element, data) {
    this.chart = new google.visualization.LineChart(element);
    this.scatter = new google.visualization.ScatterChart(document.getElementById("0" + element.id));
    this.pie = new google.visualization.PieChart(document.getElementById("1" + element.id));
    this.data = data;
  }

  setData(y, x = undefined, mod = undefined, sliderId, setSliderValue) {
    this.data = new google.visualization.DataTable();

    if (y != undefined) {
      if (x != undefined) {
        this.data.addColumn(x.type, x.name);
        this.data.addColumn(y.type, y.name);
        var values = [];
        for (let i = 0; i < y.values.length; i++) {
          values.push([x.values[i], y.values[i]]);
        }

      } else {
        this.data.addColumn("number", "x");
        this.data.addColumn(y.type, y.name);

        var values = [];
        for (let i = 0; i < y.values.length; i++) {
          values.push([i, y.values[i]]);
        }
      }

      if (mod != undefined) {
        this.data.addColumn(mod.type, mod.name);
        for (let i = 0; i < values.length; i++) {
          values[i].push(mod.values[i]);
        }
      }

    } else {
      this.data.addColumn("number", "x");
      this.data.addColumn("number", "y");
      var values = [[0, 0]];
    }

    if (setSliderValue == true) {
      sliders[Number(sliderId)] = [0, values.length];
      setSlider(Number(sliderId));

      this.data.addRows(values);
    } else {
      this.data.addRows(values.slice(...sliders[sliderId]));
    }

  }
}

//creates all the charts; creates dummy data
var charts = []
function initCharts() {
  google.charts.load("44", {
    callback: createCharts,
    packages: ["corechart"]
  });

  function createCharts() {
    let data = new google.visualization.DataTable();
    data.addColumn("number", "x");
    data.addColumn("number", "y");
    data.addRows([[0, 0]]);

    document.getElementsByName("graph_main").forEach(element => {
      charts.push(new Chart(element, data));
    });

    drawChart(null, true);
    setDropdown(layouts["defualtLayout"]);
  }
}
initCharts();

//draws, updates charts; hide them when they are created
var scales = { 0: "linear", 1: "linear", 2: "linear", 3: "linear" }
function drawChart(id = null, hide = false) {
  let scale = "linear";
  if (id != null) {
    scale = scales[id];
  }

  let options = {
    chartArea: {
      left: 40,
      top: 20,
      width: "90%",
      height: "85%"
    },
    legend: {
      position: "top"
    },
    width: "100%",
    backgroundColor: { fill: "transparent" },
    vAxis: { scaleType: scale },
    colors: lineColors
  };

  if (id == null) {
    charts.forEach(chart_ => {
      chart_.chart.draw(chart_.data, options);
      chart_.scatter.draw(chart_.data, options);
      chart_.pie.draw(chart_.data, options);
    });
  } else {
    charts[id].chart.draw(charts[id].data, options);
    charts[id].scatter.draw(charts[id].data, options);
    charts[id].pie.draw(charts[id].data, options);
    document.getElementById("dlBtn" + id).className = "";
  }

  if (hide == true) {
    document.getElementsByName("top_item_main").forEach(element => {
      element.style = "display: none;";
    });
  }
}

//updates all overview tables
function overviewTable() {
  let names = ["table_popup_side", "top_item_main_overview0", "top_item_main_overview1", "top_item_main_overview2", "top_item_main_overview3"];
  names.forEach(name => {
    let element = document.getElementById(name);
    var overviewArray = [["Name", "ID", "Type", "Length", "Operation", "Parent", "Param", "Action"]];

    datasets.dataSet_list.forEach(dataset => {
      if (dataset != null) {
        var tmp = [dataset.name, dataset.id, dataset.type, dataset.len, dataset.operation, dataset.parent, dataset.param];
      }

      if (dataset.id <= 1) {
        tmp.push("<button class='icon_container' name='" + dataset.name + "' onclick='copySetBtn(this)'><div class='icon_div copy_div'></div></button>");
      } else {
        let add_ = ""
        if (dataset.selected == true) {
          add_ = "checked";
        }

        tmp.push("<div class='flexClass'><input type='checkbox' name='" + dataset.name + "' onchange='selectSet(this)' style='margin: 3px'" + add_ + "><button class='icon_container' name='" + dataset.name + "' onclick='renameSetBtn(this)'><div class='icon_div edit_div'></div></button><button class='icon_container' name='" + dataset.name + "' onclick='deleteSetBtn(this)'><div class='icon_div trash_div'></div></button><button class='icon_container' name='" + dataset.name + "' onclick='copySetBtn(this)'><div class='icon_div copy_div'></div></button></div>");
      }

      overviewArray.push(tmp);
    });

    element.innerHTML = makeTableHTML(overviewArray);
  });
}

//simulates dropdown changes to update charts, tables, overview and the export textfield
function updateAll(graphUpdate = false) {
  if (graphUpdate == false) {
    overviewTable();
    exportField();

    for (let i = 0; i < 4; i++) {
      table(i);
    }

    updateModules();
  }

  drawChart();
}
function updateModules() {
  document.getElementsByName("module_I").forEach(element => {
    if (element.parentElement.style.display != "none" && element.parentElement.parentElement.style.display != "") {
      selected_Module(element);
    }
  });
}

//enables the edit buttons for a specific dataset
function enableEdit(element) {
  let id = element;
  for (let i = 0; i < 7; i++) {
    id = id.parentElement;
  }

  id = id.id;
  id = id[id.length - 1]
  let index = element.id.substring(10) - 1;
  if (edits[id][index] == 0) {
    edits[id][index] = 1;
  } else {
    edits[id][index] = 0;
  }
  table(id);
}

//changes value in dataset
function editValue(element) {
  let id = element;
  for (let i = 0; i < 7; i++) {
    id = id.parentElement;
  }

  id = id.id;
  id = id[id.length - 1];
  elementId = element.id;
  let op = elementId.substring(0, 1);

  if (op == "e") {
    openPopup("promptPopup", "prompt_io", "Enter new value", table, [id, op, elementId.substring(1).split(",")]);
  } else if (op == "d") {
    openPopup("promptPopup", "prompt_co", "Are you sure you want to delete the value?", table, [id, op, elementId.substring(1).split(",")], "deleteValue");
  } else if (op == "i") {
    openPopup("promptPopup", "prompt_ios", ["Enter new value to insert into the dataset", "above", "below"], table, [id, op, elementId.substring(1).split(",")]);
  } else {
    table(id, op, elementId.substring(1).split(","));
  }
}

//creates custom table for data
function table(id, editV = undefined, param = undefined, prompt = undefined) {
  let index = [];
  let tableArray = [];
  var tmpArray = ["Index"];
  let maxLen = 0;

  document.getElementsByName("column_dropdown" + id.toString()).forEach(element => {
    let len = 0;

    index.push(element.selectedIndex);
    if (element.selectedIndex != 0) {
      len = datasets.dataSet_list[element.selectedIndex - 1].len;
      let add_ = "";

      if (edits[id][tmpArray.length - 1] == 1) {
        add_ = "checked";
      }

      tmpArray.push("<div class='flexClass'>" + datasets.dataSet_names[element.selectedIndex - 1] + "<span>-</span><div class='flexClass'><label for='editEnable" + tmpArray.length + "'>edit</label><input id='editEnable" + tmpArray.length + "' onchange='enableEdit(this)' type='checkbox' " + add_ + " style='margin: 3px;'></div></div>");
    } else {
      tmpArray.push("None");
    }

    if (maxLen < len) {
      maxLen = len;
    }
  });
  tableArray.push(tmpArray);

  if (editV == "e") {
    if (prompt != null) {
      let set = datasets.dataSet_list[index[param[1] - 1] - 1]

      if (set.type == "number") {
        prompt = Number(prompt);
      }

      set.values[param[0] - 1] = prompt;

      updateAll();
    }

  } else if (editV == "d") {
    if (prompt == true) {
      let set = datasets.dataSet_list[index[param[1] - 1] - 1]
      set.values.splice(param[0] - 1, 1);

      set.updateValues(set.values);
      updateAll();
      maxLen -= 1;
    }

  } else if (editV == "i") {
    if (prompt[0] != null) {
      let set = datasets.dataSet_list[index[param[1] - 1] - 1]

      if (set.type == "number") {
        prompt[0] = Number(prompt[0]);
      }

      set.values.splice(param[0] - 1 + prompt[1], 0, prompt[0]);

      set.updateValues(set.values);
      updateAll();
      maxLen += 1;
    }
  }

  for (let i = 0; i < maxLen; i++) {
    var tmpArray = [];
    tmpArray.push(i);

    for (let j = 0; j < index.length; j++) {
      let tmp = "";
      if (index[j] != 0) {
        tmp = datasets.dataSet_list[index[j] - 1].values[i];
      }

      if (tmp == undefined) {
        tmp = "";
      } else if (tmp != "" && isNaN(tmp) == false) {
        tmp = Number(Number(tmp).toFixed(default_nDigigts)).toString();
      }

      tmpArray.push(tmp);
    }

    tableArray.push(tmpArray);
  }
  document.getElementById("table_main" + id.toString()).innerHTML = makeTableHTML(tableArray, true, id);
}

//holdes datasets; add new sets
class DataSets {
  constructor() {
    this.dataSet_list = [];
    this.dataSet_names = [];
    this.dataSetMods_names = [];
    this.deletedSets = 0;
  }

  add(set) {
    this.dataSet_list.push(set);
    this.dataSet_names.push(set.name);

    if (set.operation != "Data") {
      this.dataSetMods_names.push(set.name);
    }
  }
}
var datasets = new DataSets;

//holdes all information for a dataset
class DataSet {
  constructor(values, checkName = true, operation = "Data", name = "", parent = "", param = "", type = "", showing = true) {
    this.values = values;
    this.type = type;
    this.parent = parent;
    this.param = param;
    this.id = datasets.dataSet_list.length + datasets.deletedSets;

    if (name == "") {
      this.name = operation;
    } else {
      this.name = name.toString();
    }

    if (checkName == false) {
      this.name += this.id;
    } else {
      if (datasets.dataSet_names.indexOf(this.name) != -1) {
        this.name += this.id;
      }
    }

    this.operation = operation;
    this.showing = showing;
    this.checkName = checkName;

    this.len = values.length;
    this.selected = false;

    if (this.type == "") {
      this.type = typeof values[0];
    }
  }

  updateValues(new_values, type = "") {
    this.values = new_values;
    if (type != "") {
      this.type = type;
    }
    this.len = new_values.length;
  }
}

//delete Dataset
function deleteSetBtn(element) {
  let set = getSetbyName(element);
  let selectedList = getAllSelected();

  if (set.selected == true && selectedList.length > 1) {
    openPopup("promptPopup", "prompt_co", "Are you Sure you want to delete the selected datasets? " + selectedList.length + " selected", deleteSetSelected, [selectedList], "deleteSetSelected");
  } else {
    openPopup("promptPopup", "prompt_co", "Are you Sure you want to delete the dataset?", deleteSet, [set.name], "deleteSet");
  }
}
function deleteSet(name, prompt) {
  if (prompt == true) {
    if (datasets.dataSetMods_names.length != 0) {
      let index = datasets.dataSetMods_names.indexOf(name);

      if (index != -1) {
        datasets.dataSetMods_names.splice(index, 1);
      }
    }

    let index = datasets.dataSet_names.indexOf(name);
    datasets.dataSet_list.splice(index, 1);
    datasets.dataSet_names.splice(index, 1);

    updateDropdown(0, true);
    datasets.deletedSets += 1;
    updateModules();
  }
}
function deleteSetSelected(sets, prompt) {
  if (prompt == true) {
    sets.forEach(set => {
      deleteSet(set.name, true);
    });
  }
}

//rename Dataset
function renameSetBtn(element) {
  let set = getSetbyName(element);
  let selectedList = getAllSelected();

  if (set.selected == true && selectedList.length > 1) {
    openPopup("promptPopup", "prompt_io", "Enter new name for the selected datasets. " + selectedList.length + " selected", renameSetSelected, [selectedList]);
  } else {
    openPopup("promptPopup", "prompt_io", "Enter a new name", renameSet, [set.name]);
  }
}
function renameSet(name, prompt) {
  if (prompt != null && prompt != "") {
    let index = datasets.dataSet_names.indexOf(name);

    if (datasets.dataSet_names.indexOf(prompt) != -1) {
      prompt += datasets.dataSet_list[index].id;
    }

    datasets.dataSet_list[index].name = prompt;
    datasets.dataSet_names[index] = prompt;

    if (datasets.dataSetMods_names.length != 0) {
      let index = datasets.dataSetMods_names.indexOf(name);

      if (index != -1) {
        datasets.dataSetMods_names[index] = prompt;
      }
    }

    updateDropdown();
    updateModules();
  }
}
function renameSetSelected(sets, prompt) {
  if (prompt != null && prompt != "") {
    sets.forEach(set => {
      renameSet(set.name, prompt);
    });
  }
}

//copy Dataset
function copySetBtn(element) {
  let set = getSetbyName(element);
  let selectedList = getAllSelected();

  if (set.selected == true && selectedList.length > 1) {
    openPopup("promptPopup", "prompt_co", "Are you sure you want to copy the selected datasets? " + selectedList.length + " selected", copySetSelected, [selectedList], "copySelected");
  } else {
    copySet(set);
  }
}
function copySet(set) {
  datasets.add(new DataSet(set.values, false, "copy", "", set.name));

  updateDropdown(1);
  updateAll();
}
function copySetSelected(sets, prompt) {
  if (prompt == true) {
    sets.forEach(set => {
      copySet(set);
    });
  }
}

function getSetbyName(element) {
  let name = element.getAttribute("name");
  let index = datasets.dataSet_names.indexOf(name);

  return datasets.dataSet_list[index];
}
function getAllSelected() {
  let selectedList = [];
  datasets.dataSet_list.forEach(set => {
    if (set.selected == true) {
      selectedList.push(set);
    }
  });

  return selectedList;
}
function selectSet(element) {
  let set = getSetbyName(element);
  set.selected = !set.selected;
}

//on input in the custom prompt
function promptSubmit(element) {
  let ret;
  if (element != null) {
    let parentId = element.parentElement.id;
    let elementName = element.getAttribute("name");

    if (parentId == "prompt_co" || parentId == "prompt_o") {
      if (elementName == "ok_Btn") {

        if (parentId == "prompt_co") {
          let tmp = document.getElementById("dontAsk");
          if (tmp.checked == true && awaitButton["event"] != undefined) {
            dontShow.push(awaitButton["event"]);
            tmp.checked = false;
          }
        }

        ret = true;
      } else {
        ret = null;
      }

    } else if (parentId == "prompt_io") {
      if (elementName == "ok_Btn" || element.id == "prompt_Input") {
        let tmp = document.getElementById("prompt_Input");
        ret = filterText(tmp.value);
        tmp.value = "";

      } else {
        ret = null;
      }

    } else if (parentId == "prompt_ios") {
      if (elementName == "ok_Btn" || element.id == "prompt_Input_ios") {
        let tmp = document.getElementById("prompt_Input_ios");
        ret = filterText(tmp.value);
        tmp.value = "";
      } else {
        ret = null;
      }

      ret = [ret, document.getElementById("switch_ios").checked];
    }

  } else {
    ret = true;
  }

  if (awaitButton["callback"] != undefined) {
    awaitButton["args"].push(ret);
    awaitButton["callback"](...awaitButton["args"]);
    awaitButton = {};
  }
  openPopup(null, "close_prompt");
}

//open a Popup, hides every other
var awaitButton = {};
var dontShow = [];
function openPopup(id, type = undefined, spanText = "", callback = undefined, args = undefined, event = undefined) {
  awaitButton = {};

  if (callback != undefined) {
    awaitButton["callback"] = callback;
    awaitButton["args"] = args;
    awaitButton["event"] = event;
  }

  if (dontShow.indexOf(event) != -1) {
    promptSubmit(null);

  } else {
    if (type != "close_prompt" && id == null) {
      document.getElementsByName("popup").forEach(element => {
        element.style = "display: none;";
      });
    } else {
      document.getElementById("promptPopup").style = "display: none;";
    }

    if (id != null) {
      document.getElementById(id).style = "display: block;";

      if (id == "graph_popup") {
        updateAll(true);
      }
    }

    if (type != undefined && type != "close_prompt") {
      if (type != "prompt_ios") {
        document.getElementById("promptSpan").innerText = spanText;
      } else {
        document.getElementById("promptSpan").innerText = spanText[0];
        document.getElementById("slider_before").innerText = spanText[1];
        document.getElementById("slider_after").innerText = spanText[2];
      }

      document.getElementsByName("prompt_option").forEach(element => {
        element.style = "display: none;";
      });

      document.getElementById(type).style = "display: flex;";
    }
  }
}

//show only selected chart
function showChart(chartId, id) {
  document.getElementById("graph_main" + id).style = "display: none;";
  document.getElementById("0" + "graph_main" + id).style = "display: none;";
  document.getElementById("1" + "graph_main" + id).style = "display: none;";

  document.getElementById(chartId + "graph_main" + id).style = "display: block;";

  document.getElementById("x-Axis" + id).innerText = "x-Axis:";
  document.getElementById("y-Axis" + id).innerText = "y-Axis:";
}

//on change of every dropdown
function dropdownChange(element, isDropdown = true, setSliderValue = true) {
  if (isDropdown == true) {
    var value = element.options[element.selectedIndex].text;
  }
  let id = element.id[element.id.length - 1];
  let name = element.getAttribute("name");
  let nameId = name[name.length - 1];
  let graph = true;

  if (name.indexOf("Axis") != -1) {
    var xAxis = document.getElementById("xAxis_dropdown" + id);
    var xAxis_value = xAxis.options[xAxis.selectedIndex].text;

    var yAxis = document.getElementById("yAxis_dropdown" + id);
    var yAxis_value = yAxis.options[yAxis.selectedIndex].text;

    var modAxis = document.getElementById("modAxis_dropdown" + id);
    var modAxis_value = modAxis.options[modAxis.selectedIndex].text;

    var modSet;
    datasets.dataSet_list.forEach(set => {
      if (set.name == modAxis_value) {
        modSet = set;
      }
    });

    var setX = datasets.dataSet_list[datasets.dataSet_names.indexOf(xAxis_value)];
    var setY = datasets.dataSet_list[datasets.dataSet_names.indexOf(yAxis_value)];
    var setValue = datasets.dataSet_list[datasets.dataSet_names.indexOf(value)];
  }

  if (name == "top_dropdown") {
    document.getElementById("top_item_main" + id).style = "display: none;";
    document.getElementById("top_item_main_table" + id).style = "display: none;";
    document.getElementById("top_item_main_overview" + id).style = "display: none;";

    if (value == "Graph" || value == "Scatter" || value == "Pie Chart") {
      document.getElementById("top_item_main" + id).style = "display: flex;";
      if (value == "Graph") {
        showChart("", id);
      } else if (value == "Scatter") {
        showChart("0", id);
      } else if (value == "Pie Chart") {
        showChart("1", id);
        document.getElementById("y-Axis" + id).innerText = "Values:";
        document.getElementById("x-Axis" + id).innerText = "Index:";
      }

    } else if (value == "Table") {
      document.getElementById("top_item_main_table" + id).style = "display: block;";
      table(id);

    } else if (value == "Overview") {
      let overviewElement = document.getElementById("top_item_main_overview" + id);
      overviewElement.style = "display: block;";
      overviewTable();
    }

  } else if (name == "yAxis_dropdown") {
    if (xAxis.selectedIndex == 0) {
      charts[id].setData(setValue, undefined, modSet, id, setSliderValue);
    } else {
      charts[id].setData(setValue, setX, modSet, id, setSliderValue);
    }

  } else if (name == "xAxis_dropdown") {
    if (yAxis.selectedIndex != 0) {
      if (element.selectedIndex == 0) {
        charts[id].setData(setY, undefined, modSet, id, setSliderValue);
      } else {
        charts[id].setData(setY, setValue, modSet, id, setSliderValue);
      }
    }

  } else if (name == "modAxis_dropdown") {
    if (yAxis.selectedIndex != 0) {
      charts[id].setData(setY, setX, modSet, id, setSliderValue);
    }

  } else if (name.substring(0, name.length - 1) == "column_dropdown") {
    table(nameId);
    graph = false;

  } else if (name == "bottom_dropdown") {
    document.getElementsByName("module" + id.toString()).forEach(element => {
      element.remove();
    });

    let simple_mod = true;
    if (["Cut", "n-Fit", "Calculator", "Function Gen", "Misc", "Downloads"].includes(value)) {
      //^ those modules dont support simple_mod; requires own Div
      simple_mod = false;
    }

    if (element.selectedIndex != 0) {
      show_Module(value.toLowerCase().replace(" ", "_").replace("/", "_"), id, simple_mod);
    }

    graph = false;

  } else if (name == "setScale") {
    if (document.getElementById("setScale" + id).checked == true) {
      scales[id] = "log";
    } else {
      scales[id] = "linear";
    }
  }

  if (graph == true) {
    drawChart(id, false);
  }
}

//set the selected option of a dropdown
function setDropdown(array) {
  array.forEach(element => {
    let tmp = document.getElementById(element[0]);
    tmp.selectedIndex = element[1];
    dropdownChange(tmp);
  });
}

//updates all dropdowns, i.e. on new dataset
function updateDropdown(append = 0, remove = false, mod = true) {
  overviewTable();
  exportTable();
  exportField();

  setupDropdown("xAxis_dropdown", datasets.dataSet_names, append, remove);
  setupDropdown("yAxis_dropdown", datasets.dataSet_names, append, remove);
  for (let i = 0; i < 4; i++) {
    setupDropdown("column_dropdown" + i.toString(), datasets.dataSet_names, append, remove);
  }
  setupDropdown("module_I", datasets.dataSet_names, append, remove);
  setupDropdown("module_Ix", datasets.dataSet_names, append, remove);
  setupDropdown("molule_Idataset", datasets.dataSet_names, append, remove);
  setupDropdown("modAxis_dropdown", datasets.dataSetMods_names, append, remove, mod);
}

//create link element
var pressLink = true;
function createLink(href, name, download, btnID, resolution = "") {
  let link = document.createElement("a");
  let date = new Date();
  link.href = href;
  link.setAttribute("name", name)
  link.setAttribute("time", date.getHours() + ":" + date.getMinutes());
  link.setAttribute("resolution", resolution);
  link.download = download;
  document.body.appendChild(link);

  if (pressLink == true) {
    link.click();
  }
  document.getElementById(btnID).className = "pressedBtn";
  listDownloads();
}

//download chart as svg/png
function downloadChartBtn(element) {
  openPopup("promptPopup", "prompt_ios", ["Enter Filename. Change PNG resolution setting in 'Misc'", "SVG", "PNG"], downloadChart, [element]);
}
function downloadChart(element, prompt) {
  if (prompt[0] != null && prompt[0] != "") {
    if (prompt[0].substring(0, 2) != "!h") {
      let id = element.id.substr(element.id.length - 1);
      let parent = document.getElementById("top_item_main" + id);
      let graphs = parent.getElementsByClassName("graph_main");

      for (let i = 0; i < graphs.length; i++) {
        if (graphs[i].style.display == "block") {
          var target = graphs[i];
        }
      }

      let svgElement = target.getElementsByTagName("svg")[0];

      let serializer = new XMLSerializer();
      let source = serializer.serializeToString(svgElement);

      if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
      }
      if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
      }

      source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
      let encodedUri = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);

      if (prompt[1] == false) {
        createLink(encodedUri, "dl", prompt[0] + ".svg", "dlBtn" + id);

      } else {
        let [width, height] = resolution;
        let canvas = document.querySelector("canvas");
        canvas.setAttribute("height", height);
        canvas.setAttribute("width", width);

        let context = canvas.getContext("2d");

        let image = new Image;
        image.src = encodedUri;
        image.onload = function () {
          context.drawImage(image, 0, 0, width, height);
          createLink(canvas.toDataURL("image/png"), "dl", prompt[0] + ".png", "dlBtn" + id, resolution.join(" x "));
        };
      }

    } else {
      let links = document.getElementsByName("dl");
      let link = links[links.length - 1 - prompt[0].substring(2, prompt[0].length)];

      if (link != undefined) {
        link.click();
      }
    }
  }
}

//on keyDown event
var layouts = {
  "defualtLayout": [["top_dropdown0", 1], ["top_dropdown1", 4], ["top_dropdown2", 5], ["top_dropdown3", 0], ["bottom_dropdown0", 0], ["bottom_dropdown1", 0], ["bottom_dropdown2", 0], ["bottom_dropdown3", 1]],
  "newLayout": [["top_dropdown0", 0], ["top_dropdown1", 0], ["top_dropdown2", 0], ["top_dropdown3", 0], ["bottom_dropdown0", 0], ["bottom_dropdown1", 0], ["bottom_dropdown2", 0], ["bottom_dropdown3", 0]],
  "settings": [["bottom_dropdown3", 5]]
};
var keyDowns = {};
var CalcAlias = { "c": "ac", "p": "pm", "-": "min", "+": "plus", "/": "div", "%": "perc", ",": "k", "Enter": "eq", "=": "eq" }
function keyDown(event) {
  if (event.key != "Shift") {
    keyDowns[event.key] = true;
  }

  let focused = false;
  let tmp = [...document.getElementsByTagName("input")];
  tmp.push(...document.getElementsByTagName("textarea"));

  for (let i = 0; i < tmp.length; i++) {
    if (tmp[i] === document.activeElement && tmp[i].id != "prompt_Input") {
      focused = true;
      break;
    }
  }

  let keys = Object.keys(keyDowns);

  if (focused == false) {
    if (keyDowns["l"] == true) {
      if (keyDowns["1"] == true) {
        setDropdown(layouts["defualtLayout"]);
      } else if (keyDowns["0"] == true) {
        setDropdown(layouts["newLayout"]);
      }

    } else if (keyDowns["d"] == true) {
      if (keyDowns["t"] == true) {
        importTestData();
      } else if (keyDowns["v"] == true) {
        logVars();
      }

    } else if (keyDowns["o"] == true) {
      if (keyDowns["s"] == true) {
        setDropdown(layouts["settings"]);
      }

    } else if (keys.length == 1 && document.getElementById("promptPopup").style.display == "block") {
      let key = keys[0];

      let okBtn = null;
      document.getElementsByName("prompt_option").forEach(element => {
        if (element.style.display != "none") {
          okBtn = element.getElementsByClassName("promptInput okBtn")[0];
        }
      });

      if (key == "Escape") {
        openPopup(null, "close_prompt");
      } else if (key == "Enter") {
        promptSubmit(okBtn);
      }

    } else if (keys.length == 1 && document.getElementById("bottom_dropdown3").selectedIndex == 1) {
      let key = keys[0];

      if (isNaN(key) == false) {
        document.getElementById("calc_" + key).click();
      } else if (CalcAlias[key] != undefined) {
        document.getElementById("calc_" + CalcAlias[key]).click();
      }
    }
  }
}
function keyUp(event) {
  delete keyDowns[event.key];
}

//import default datasets
function importData() {
  let r = [];
  let rp = [];
  for (let i = -1000; i < 1001; i++) {
    r.push(i / 10);
    if (i >= 0) {
      rp.push(i / 10);
    }
  }

  datasets.add(new DataSet(r, true, "", "R"));
  datasets.add(new DataSet(rp, true, "", "R+"));

  updateDropdown();
}
function importTestData() {
  let td = [
    [NaN, 0, 0.4307, 0.6826, 0.8614, 1, 1.1133, 1.2091, 1.292, 1.3652, 1.4307, 1.4899, 1.544, 1.5937, 1.6397, 1.6826, 1.7227, 1.7604, 1.7959, 1.8295, 1.8614, 1.8917, 1.9206, 1.9482, 1.9746, 2, 2.0244, 2.0478, 2.0704, 2.0922, 2.1133, 2.1337, 2.1534, 2.1725, 2.1911, 2.2091, 2.2266, 2.2436, 2.2602, 2.2763, 2.292, 2.3074, 2.3223, 2.337, 2.3512, 2.3652, 2.3789, 2.3922, 2.4053, 2.4181],
    [NaN, -0.1368, 0.6703, 0.8718, 0.6206, 0.7772, 1.3517, 1.3775, 1.1259, 1.5494, 1.5538, 1.5324, 1.4842, 1.4384, 1.5625, 1.6888, 1.7656, 1.989, 1.7658, 1.8658, 2.1068, 1.7356, 2.1082, 1.7945, 1.927, 2.0463, 1.7878, 2.193, 1.986, 1.9449, 2.3494, 2.3796, 2.3472, 2.3393, 2.2007, 2.1986, 2.1299, 2.3887, 2.1213, 2.111, 2.517, 2.4481, 2.5304, 2.1298, 2.1617, 2.327, 2.4663, 2.4972, 2.1611, 2.4104],
    [-99, -71.3, -49, -31.5, -18.2, -8.5, -1.8, 2.5, 5, 6.3, 7, 7.7, 9, 11.5, 15.8, 22.5, 32.2, 45.5, 63, 85.3]
  ];

  datasets.add(new DataSet(td[0], false, "Test"));
  datasets.add(new DataSet(td[1], false, "Test"));
  datasets.add(new DataSet(td[2], false, "Test"));

  updateDropdown();
}

//log global vars
var CC = {
  reset: '\033[0m',

  black: '\033[30m',
  red: '\033[31m',
  green: '\033[32m',
  yellow: '\033[33m',
  blue: '\033[34m',
  magenta: '\033[35m',
  cyan: '\033[36m',
  white: '\033[37m',
}
function logType(Variable) {
  let ret = "";
  if (Array.isArray(Variable) == true) {
    ret = "A"
    if (Variable[0] != undefined) {
      ret += logType(Variable[0]);
    }
  } else if (typeof Variable == "object") {
    ret = "O";
  } else if (isNaN(Variable) == false) {
    ret = "N";
  } else {
    ret = "S";
  }

  return ret;
}
function fillZero(String) {
  let tmp = "0" + String;
  return tmp.substr(tmp.length-2, 2);
}
function logVars() {
  let date = new Date();

  console.log(`${CC.yellow}------ Global Vars: [${date.getHours()}:${fillZero(date.getMinutes())}:${fillZero(date.getSeconds())}] ${CC.cyan}(A: Array, O: Object, N: Number, S: String) ${CC.yellow}------`)
  let label1 = `${CC.red}data_viewer.js: `;
  console.group(label1);
  console.info(`-> ${CC.magenta}(General) ${CC.cyan}(${logType(datasets)})`, "'datasets': ", datasets);
  console.info(`-> ${CC.magenta}(General) ${CC.cyan}(${logType(default_nDigigts)})`, "'default_nDigigts': ", default_nDigigts);
  console.info(`-> ${CC.magenta}(Hotkeys) ${CC.cyan}(${logType(keyDowns)})`, "'keyDowns': ", keyDowns);
  console.info(`-> ${CC.magenta}(Hotkeys) ${CC.cyan}(${logType(layouts)})`, "'layouts': ", layouts);
  console.info(`-> ${CC.magenta}(Save Chart) ${CC.cyan}(${logType(resolution)})`, "'resolution': ", resolution);
  console.info(`-> ${CC.magenta}(Draw Chart) ${CC.cyan}(${logType(lineColors)})`, "'lineColors': ", lineColors);
  console.info(`-> ${CC.magenta}(Draw Chart) ${CC.cyan}(${logType(charts)})`, "'charts': ", charts);
  console.info(`-> ${CC.magenta}(Draw Chart) ${CC.cyan}(${logType(sliders)})`, "'sliders': ", sliders);
  console.info(`-> ${CC.magenta}(Draw Chart) ${CC.cyan}(${logType(scales)})`, "'scales': ", scales);
  console.info(`-> ${CC.magenta}(Draw Table) ${CC.cyan}(${logType(edits)})`, "'edits': ", edits);
  console.info(`-> ${CC.magenta}(Prompt handler) ${CC.cyan}(${logType(awaitButton)})`, "'awaitButton': ", awaitButton);
  console.info(`-> ${CC.magenta}(Prompt handler) ${CC.cyan}(${logType(dontShow)})`, "'dontShow': ", dontShow);
  console.groupEnd(label1);

  let label2 = `${CC.red}io_data.js:`;
  console.group(label2);
  console.info(`-> ${CC.magenta}(Import) ${CC.cyan}(${logType(csvData)})`, "'csvData': ", csvData);
  console.info(`-> ${CC.magenta}(Import) ${CC.cyan}(${logType(buttonData)})`, "'buttonData': ", buttonData);
  console.info(`-> ${CC.magenta}(Import) ${CC.cyan}(${logType(skip_row)})`, "'skip_row': ", skip_row);
  console.info(`-> ${CC.magenta}(Import) ${CC.cyan}(${logType(csvDelimiter)})`, "'csvDelimiter': ", csvDelimiter);
  console.groupEnd(label2);

  let label3 = `${CC.red}modules.js:`;
  console.group(label3)
  console.info(`-> ${CC.magenta}(Modules) ${CC.cyan}(${logType(tempSet)})`, "'tempSet': ", tempSet);
  console.info(`-> ${CC.magenta}(Modules) ${CC.cyan}(${logType(slot_offset)})`, "'slot_offset': ", slot_offset);
  console.info(`-> ${CC.magenta}(Calculator) ${CC.cyan}(${logType(calcs)})`, "'calcs': ", calcs);
  console.groupEnd(label3)

  document.getElementById("openConsoleSpan").style.display = "";
}

window.addEventListener("keydown", keyDown);
window.addEventListener("keyup", keyUp);

window.onresize = () => { updateAll(true); }
window.onload = () => {
  importData();

  let date = new Date;
  let hrs = date.getHours()

  if (hrs >= 20 || hrs <= 8) {
    document.getElementById("theme_input").click();
  }

  getGET();
};

window.addEventListener('beforeunload', function (e) {
  if (datasets.dataSet_list.length > 2) {
    e.preventDefault();
    e.returnValue = '';
  }
});

//who tf uses window.print()?? im bored.
var printReset = { "invert": 0, "theme": 0 };
window.addEventListener("beforeprint", function (e) {
  let themeElement = document.getElementById("theme_input");
  if (themeElement.checked == true) {
    printReset["theme"] = 1;
    themeElement.click();
  }

  let invertElement = document.getElementById("invert_input");
  if (invertElement.checked == true) {
    printReset["invert"] = 1;
    invertElement.click();
  }

  document.body.style = "width: 1650px; height: 1100px;";

  updateAll(true);
});

window.addEventListener("afterprint", function (e) {
  if (printReset["theme"] == 1) {
    document.getElementById("theme_input").click();
  }
  if (printReset["invert"] == 1) {
    document.getElementById("invert_input").click();
  }

  printReset = { "invert": 0, "theme": 0 };
  document.body.style = "";

  updateAll(true);
});