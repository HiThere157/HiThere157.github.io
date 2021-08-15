function setupHTML() {
  document.getElementsByName("table_header").forEach(element => {
    let id = element.id[element.id.length - 1];

    for (let n = 1; n < 6; n++) {
      let select = document.createElement("select");
      select.setAttribute("name", "column_dropdown" + id.toString());
      select.onchange = function () { dropdownChange(this); };

      let label = document.createElement("label");
      label.innerText = " C" + n.toString() + ":";

      element.appendChild(label);
      element.appendChild(select);
    }
  });

  document.getElementsByName("graph_header").forEach(element => {
    let id = element.id[element.id.length - 1];

    let scaleLabel = document.createElement("label");
    scaleLabel.id = "setScaleLabel" + id.toString();
    scaleLabel.innerText = "Log Scale";

    let scaleInput = document.createElement("input");
    scaleInput.type = "checkbox";
    scaleInput.setAttribute("name", "setScale");
    scaleInput.id = "setScale" + id.toString();
    scaleInput.onchange = function () { dropdownChange(this, false); };

    element.appendChild(scaleLabel);
    element.appendChild(scaleInput);

    let axis_ = ["x", "y", "mod"];
    axis_.forEach(axis => {
      let select = document.createElement("select");
      select.setAttribute("name", axis + "Axis_dropdown");
      select.id = axis + "Axis_dropdown" + id.toString();
      select.onchange = function () { dropdownChange(this); };

      let label = document.createElement("label");
      label.id = axis + "-Axis" + id.toString();
      label.innerText = axis + "-Axis";

      element.appendChild(label);
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
}
setupHTML();

function makeTableHTML(Array, buttons = false) {
  if (Array != null) {
    var result = "<table>";
    for (var i = 0; i < Array.length; i++) {
      result += "<tr>";
      for (var j = 0; j < Array[i].length; j++) {
        var tmp = Array[i][j];
        var htmlButton = " <button id='" + i + "," + j + "' onclick='editValue(this)'>E</button>"
        if (tmp == undefined) {
          tmp = "";
        }
        result += "<td>" + tmp.toString();

        if (tmp.toString() != "" && i >= 1 && j >= 1 && buttons == true) {
          result += htmlButton;
        }

        result += "</td>";
      }
      result += "</tr>";
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
  var s = false;
  if (name == "yAxis_dropdown" || name.substring(0, name.length - 1) == "column_dropdown" || name == "module_I" || name == "modAxis_dropdown" || name == "molule_Idataset") {
    options.unshift("--Select--");
    s = true;
  } else if (name == "xAxis_dropdown" || name == "module_Ix") {
    options.unshift("N");
    s = true;
  }

  let elements = document.getElementsByName(name);
  elements.forEach(element => {
    var options_;

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
setupDropdown("top_dropdown", ["--Select--", "Graph", "Scatter Chart", "Pie Chart", "Table", "Overview"]);
setupDropdown("bottom_dropdown", [["--Select--", "Min Max", "Delta", "Abs", "Gaussian Average"], ["--Select--", "Log", "Exp", "Root", "Add/Sub", "Mul", "Pow"], ["--Select--", "n-Fit", "xFlip", "Cut"], ["--Select--", "Calculator", "Function Gen", "Noise Gen", "Links"]]);
setupDropdown("fGen_types", ["--Select--", "Linear", "Poly", "Exp", "Log", "Sin", "Cos", "Tan"]);

//contains 3 google Chart charts; sets data for chart
class Chart {
  constructor(element, data) {
    this.chart = new google.visualization.LineChart(element);
    this.scatter = new google.visualization.ScatterChart(document.getElementById("0" + element.id));
    this.pie = new google.visualization.PieChart(document.getElementById("1" + element.id));
    this.data = data;
  }

  setData(y, x = "", mod = "") {
    this.data = new google.visualization.DataTable();

    if (x != "") {
      this.data.addColumn(x.type, x.name);
      this.data.addColumn(y.type, y.name);
      var values = [];
      for (var i = 0; i < y.values.length; i++) {
        values.push([x.values[i], y.values[i]]);
      }

    } else {
      this.data.addColumn("number", "x");
      this.data.addColumn(y.type, y.name);

      var values = [];
      for (var i = 0; i < y.values.length; i++) {
        values.push([i, y.values[i]]);
      }
    }

    if (mod != "") {
      this.data.addColumn(mod.type, mod.name);
      for (let i = 0; i < values.length; i++) {
        values[i].push(mod.values[i]);
      }
    }

    this.data.addRows(values);
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
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    data.addColumn('number', 'y');
    data.addRows([[0, 0]]);

    document.getElementsByName("graph_main").forEach(element => {
      charts.push(new Chart(element, data));
    });

    drawChart(null, true);
  }
}
initCharts();

//draws, updates charts; hide them when they are created
function drawChart(id = null, hide = false, scale = "linear") {
  var options = {
    chartArea: {
      left: 40,
      width: '90%'
    },
    legend: {
      position: 'top'
    },
    width: '100%',
    backgroundColor: { fill: 'transparent' },
    vAxis: { scaleType: scale }
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
  }

  if (hide == true) {
    document.getElementsByName("top_item_main").forEach(element => {
      element.style = "display: none;";
    });
  }
}

//updates all overview tables
function overviewTable() {
  var names = ["table_popup_side", "top_item_main_overview0", "top_item_main_overview1", "top_item_main_overview2", "top_item_main_overview3"];
  names.forEach(name => {
    var element = document.getElementById(name);
    var overviewArray = [["Name", "ID", "Type", "Length", "Operation", "Parent", "Param", "Action"]];

    datasets.dataSet_list.forEach(dataset => {
      if (dataset != null) {
        overviewArray.push([dataset.name, dataset.id, dataset.type, dataset.len, dataset.operation, dataset.parent, dataset.param, "<button name='" + dataset.name + "' onclick='deleteSet(this)'>Delete</button><button name='" + dataset.name + "' onclick='renameSet(this)'>Rename</button>"]);
      }
    });

    element.innerHTML = makeTableHTML(overviewArray);
  });
}


function editValue(element) {
  let id = element.parentElement.parentElement.parentElement.parentElement.parentElement.id;
  id = id[id.length - 1]
  table(id, true, element.id.split(","))
}

//creates custom table for data
function table(id, editV = false, param = undefined) {
  var index = [];
  var tableArray = [];
  var tmpArray = ["Index"];
  var maxLen = 0;

  document.getElementsByName("column_dropdown" + id.toString()).forEach(element => {
    var len = 0;

    index.push(element.selectedIndex);
    if (element.selectedIndex != 0) {
      var len = datasets.dataSet_list[element.selectedIndex - 1].len;
      tmpArray.push(datasets.dataSet_names[element.selectedIndex - 1]);
    } else {
      tmpArray.push("None");
    }

    if (maxLen < len) {
      maxLen = len;
    }
  });
  tableArray.push(tmpArray);

  if (editV == true) {
    let value = window.prompt("Enter new Value", "").toString();
    if(value != null){
      let set = datasets.dataSet_list[index[param[1] - 1] - 1]

      if(set.type == "number"){
        value = Number(value);
      }

      set.values[param[0] - 1] = value;

      exportField()
    }
  }

  for (let i = 0; i < maxLen; i++) {
    var tmpArray = [];
    tmpArray.push(i);

    for (let j = 0; j < index.length; j++) {
      var tmp = "";
      if (index[j] != 0) {
        tmp = datasets.dataSet_list[index[j] - 1].values[i];
      }

      if (tmp == undefined) {
        tmp = "";
      } else if (tmp != "" && isNaN(tmp) == false) {
        tmp = Number(Number(tmp).toFixed(4)).toString();
      }

      tmpArray.push(tmp);
    }

    tableArray.push(tmpArray);
  }
  document.getElementById("table_main" + id.toString()).innerHTML = makeTableHTML(tableArray, true);
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
      this.name = name;
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

    if (this.type == "") {
      this.type = typeof values[0];
    }

  }

  updateValues(new_values, type = "", operation = "") {
    if (this.checkName == false) {
      this.values = new_values;
      this.type = type;
      this.operation = operation;

      this.len = values.length;

      if (this.type == "") {
        this.type = typeof values[0];
      }
    }
  }
}

function deleteSet(element) {
  let name = element.getAttribute("name")
  if (confirm("Are you sure?") == true) {
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
  }
}

function renameSet(element) {
  let name = element.getAttribute("name");
  let new_name = window.prompt("Enter new name", "");

  if (new_name != null && new_name != "") {
    let index = datasets.dataSet_names.indexOf(name);

    if (datasets.dataSet_names.indexOf(new_name) != -1) {
      new_name += datasets.dataSet_list[index].id;
    }

    datasets.dataSet_list[index].name = new_name;
    datasets.dataSet_names[index] = new_name;

    if (datasets.dataSetMods_names.length != 0) {
      let index = datasets.dataSetMods_names.indexOf(name);

      if (index != -1) {
        datasets.dataSetMods_names[index] = new_name;
      }
    }

    updateDropdown();
  }
}

//show only selected chart
function showChart(chartId, id) {
  document.getElementById("graph_main" + id).style = "display: none;";
  document.getElementById("0" + "graph_main" + id).style = "display: none;";
  document.getElementById("1" + "graph_main" + id).style = "display: none;";

  document.getElementById(chartId + "graph_main" + id).style = "display: block;";

  document.getElementById("x-Axis" + id).innerText = "x-Axis";
  document.getElementById("y-Axis" + id).innerText = "y-Axis";
}

//on change of every dropdown
function dropdownChange(element, isDropdown = true) {
  if (isDropdown == true) {
    var value = element.options[element.selectedIndex].text;
  }
  let id = element.id[element.id.length - 1];
  let name = element.getAttribute("name");
  let nameId = name[name.length - 1];
  let graph = true;
  let scale = "linear";

  if (name.indexOf("Axis") != -1) {
    var xAxis = document.getElementById("xAxis_dropdown" + id);
    var xAxis_value = xAxis.options[xAxis.selectedIndex].text;

    var yAxis = document.getElementById("yAxis_dropdown" + id);
    var yAxis_value = yAxis.options[yAxis.selectedIndex].text;

    var setX = datasets.dataSet_list[datasets.dataSet_names.indexOf(xAxis_value)];
    var setY = datasets.dataSet_list[datasets.dataSet_names.indexOf(yAxis_value)];
    var setValue = datasets.dataSet_list[datasets.dataSet_names.indexOf(value)];
  }

  if (name == "top_dropdown") {
    document.getElementById("top_item_main" + id).style = "display: none;";
    document.getElementById("top_item_main_table" + id).style = "display: none;";
    document.getElementById("top_item_main_overview" + id).style = "display: none;";

    if (value == "Graph" || value == "Scatter Chart" || value == "Pie Chart") {
      document.getElementById("top_item_main" + id).style = "display: block;";
      if (value == "Graph") {
        showChart("", id);
      } else if (value == "Scatter Chart") {
        showChart("0", id);
      } else if (value == "Pie Chart") {
        showChart("1", id);
        document.getElementById("y-Axis" + id).innerText = "Values";
        document.getElementById("x-Axis" + id).innerText = "Index";
      }

    } else if (value == "Table") {
      document.getElementById("top_item_main_table" + id).style = "display: block;";

    } else if (value == "Overview") {
      let overviewElement = document.getElementById("top_item_main_overview" + id);
      overviewElement.style = "display: block;";
      overviewTable();
    }

  } else if (name == "yAxis_dropdown" && element.selectedIndex != 0) {
    if (xAxis.selectedIndex == 0) {
      charts[id].setData(setValue);
    } else {
      charts[id].setData(setValue, setX);
    }

  } else if (name == "xAxis_dropdown") {
    if (yAxis.selectedIndex != 0) {
      if (element.selectedIndex == 0) {
        charts[id].setData(setY);
      } else {
        charts[id].setData(setY, setValue);
      }
    }

  } else if (name == "modAxis_dropdown") {
    if (yAxis.selectedIndex != 0) {
      var tmp;
      datasets.dataSet_list.forEach(set => {
        if (set.name == value) {
          tmp = set;
        }
      });
      charts[id].setData(setY, setX, tmp);
    }

  } else if (name.substring(0, name.length - 1) == "column_dropdown") {
    table(nameId);
    graph = false;

  } else if (name == "bottom_dropdown") {
    document.getElementsByName("module" + id.toString()).forEach(element => {
      element.remove();
    });

    var simple_mod = true;
    if (["Min Max", "Cut", "n-Fit", "Calculator", "Function Gen", "Links"].includes(value)) {
      //^ Those Modules dont support simple_mod; requires own Div
      simple_mod = false;
    }

    if (element.selectedIndex != 0) {
      show_Module(value.toLowerCase().replace(" ", "_").replace("/", "_"), id, simple_mod);
    }

    graph = false;

  } else if (name == "setScale") {
    if (document.getElementById("setScale" + id).checked == true) {
      scale = "log";
    }
  }

  if (graph == true) {
    drawChart(id, false, scale);
  }
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

//on new overlay color
function colorChange(element) {
  document.documentElement.style.setProperty("--header", element.value);
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

window.onload = importData;