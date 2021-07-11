function setupHTML() {
  document.getElementsByName("table_header").forEach(element => {
    let id = element.id[element.id.length - 1];

    for (let n = 1; n < 6; n++) {
      let select = document.createElement("select");
      select.setAttribute("name", "column_dropdown" + id.toString());
      select.onchange = function () { dropdownChange(this); };

      let label = document.createElement("label");
      label.innerText = "C " + n.toString();

      element.appendChild(label);
      element.appendChild(select);
    }
  });

  document.getElementsByName("graph_header").forEach(element => {
    let id = element.id[element.id.length - 1];

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

function makeTableHTML(Array) {
  if (Array != null) {
    var result = "<table>";
    for (var i = 0; i < Array.length; i++) {
      result += "<tr>";
      for (var j = 0; j < Array[i].length; j++) {
        result += "<td>" + Array[i][j].toString() + "</td>";
      }
      result += "</tr>";
    }
    result += "</table>";

    return result;
  } else {
    return "";
  }
}

function removeAllOptions(element) {
  while (element.options.length > 0) {
    element.remove(0);
  }
}

function setupDropdown(name, options, append = false, remove = false) {
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

    if (append == true && name != "top_dropdown" && name != "bottom_dropdown") {
      options_ = [options[options.length - 1]];
    } else {
      if (remove == false) {
        removeAllOptions(element);

        if (name == "bottom_dropdown" && append == false) {
          options_ = options[element.id[element.id.length - 1]]
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
        if (option != null) {
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
setupDropdown("bottom_dropdown", [["--Select--", "Min Max", "Delta", "Abs", "Gaussian Average"], ["--Select--", "Log", "Exp", "Root", "Add/Sub", "Mul", "Pow"], ["--Select--", "n-Fit", "xFlip", "Cut"], ["--Select--", "Calculator", "Function Gen", "Links"]]);
setupDropdown("fGen_types", ["--Select--", "Poly", "Exp", "Log", "Sin", "Cos", "Tan"])

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
      console.log()
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

function drawChart(id = null, hide = false) {
  var options = {
    chartArea: {
      left: 40,
      width: '100%'
    },
    legend: {
      position: 'top'
    },
    width: '100%'
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

function overviewTable() {
  var names = ["table_popup_side", "top_item_main_overview0", "top_item_main_overview1", "top_item_main_overview2", "top_item_main_overview3"];
  names.forEach(name => {
    var element = document.getElementById(name);
    let overviewArray = [["Name", "ID", "Type", "Length", "Operation", "Parent", "Param", "Action"]];

    datasets.dataSet_list.forEach(dataset => {
      if (dataset != null) {
        overviewArray.push([dataset.name, dataset.id, dataset.type, dataset.len, dataset.operation, dataset.parent, dataset.param, "<button name='" + dataset.name + "' onclick='deleteSet(this)'>Delete</button><button name='" + dataset.name + "' onclick='renameSet(this)'>Rename</button>"]);
      }
    });

    element.innerHTML = makeTableHTML(overviewArray);
  });
}

function table(element) {
  let id = element.getAttribute("name");
  id = id[id.length - 1]
  let index = [];
  let tableArray = [];
  let tmpArray = ["Index"];
  let maxLen = 0;

  document.getElementsByName("column_dropdown" + id.toString()).forEach(element => {
    var len = 0;

    index.push(element.selectedIndex)
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

  for (let i = 0; i < maxLen; i++) {
    let tmpArray = [];
    tmpArray.push(i);

    for (let j = 0; j < index.length; j++) {
      var tmp = "";
      if (index[j] != 0) {
        tmp = Number( (datasets.dataSet_list[index[j] - 1].values[i]).toFixed(4) );
      }

      if (tmp == undefined) {
        tmp = "";
      }

      tmpArray.push(tmp);
    }

    tableArray.push(tmpArray);
  }
  document.getElementById("table_main" + id.toString()).innerHTML = makeTableHTML(tableArray);
}

class DataSets {
  constructor() {
    this.dataSet_list = [];
    this.dataSet_names = [];
    this.dataSetMods_names = [];
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

class DataSet {
  constructor(values, user_input = true, operation = "Data", name = "", parent = "", param = "", type = "", showing = true) {
    this.values = values;
    this.type = type;
    this.parent = parent;
    this.param = param;

    if (name == "") {
      this.name = operation;
    } else {
      this.name = name;
    }
    this.name += datasets.dataSet_list.length.toString();

    this.operation = operation;
    this.showing = showing;
    this.id = datasets.dataSet_list.length;
    this.user_input = user_input;

    this.len = values.length;

    if (this.type == "") {
      this.type = typeof values[0];
    }

  }

  updateValues(new_values, type = "", operation = "") {
    if (this.user_input == false) {
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

    updateDropdown(false, true);
  }
}

function renameSet(element) {
  let name = element.getAttribute("name")
  let new_name = window.prompt("Enter new name", "");

  if (new_name != null || new_name != "") {
    if (datasets.dataSetMods_names.length != 0) {
      let index = datasets.dataSetMods_names.indexOf(name);

      if (index != -1) {
        datasets.dataSetMods_names[index] = new_name;
      }
    }

    let index = datasets.dataSet_names.indexOf(name);
    datasets.dataSet_list[index].name = new_name;
    datasets.dataSet_names[index] = new_name;

    updateDropdown();
  }
}

function showChart(chartId, id) {
  document.getElementById("graph_main" + id).style = "display: none;";
  document.getElementById("0" + "graph_main" + id).style = "display: none;";
  document.getElementById("1" + "graph_main" + id).style = "display: none;";

  document.getElementById(chartId + "graph_main" + id).style = "display: block;";

  document.getElementById("x-Axis" + id).innerText = "x-Axis";
  document.getElementById("y-Axis" + id).innerText = "y-Axis";
}

function dropdownChange(element) {
  let value = element.options[element.selectedIndex].text;
  let id = element.id[element.id.length - 1];
  let name = element.getAttribute("name");
  let graph = true;

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
    table(element);
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
  }

  if (graph == true) {
    drawChart(id);
  }

}

function updateDropdown(append = false, remove = false) {
  overviewTable();

  setupDropdown("xAxis_dropdown", datasets.dataSet_names, append, remove);
  setupDropdown("yAxis_dropdown", datasets.dataSet_names, append, remove);
  for (let i = 0; i < 4; i++) {
    setupDropdown("column_dropdown" + i.toString(), datasets.dataSet_names, append, remove);
  }
  setupDropdown("module_I", datasets.dataSet_names, append, remove);
  setupDropdown("module_Ix", datasets.dataSet_names, append, remove);
  setupDropdown("molule_Idataset", datasets.dataSet_names, append, remove)
  setupDropdown("modAxis_dropdown", datasets.dataSetMods_names, append, remove);
}

function importData() {
  var raw_data = [70.6835, 0, 72.2369, 1.5534, 67.5765, -4.66041, 81.5578, 13.9813, 80.7811, -0.776709, 76.8974, -3.88372, 83.1113, 6.21391, 83.1113, 0.0000147899, 80.7811, -2.33021, 83.8881, 3.10696, 71.4602, -12.4279, 71.4602, -0.00000410585, 73.7904, 2.33022, 73.0137, -0.776722, 76.8974, 3.88368, 84.6648, 7.7674, 81.5578, -3.10697, 82.3346, 0.776774, 96.3159, 13.9813, 89.3252, -6.99065, 79.2276, -10.0976, 96.3159, 17.0883, 89.3252, -6.99065, 83.8881, -5.43714, 68.3532, -15.5349, 71.4602, 3.107, 73.0137, 1.55348, 63.6928, -9.32092, 60.5858, -3.10698, 68.3532, 7.76743, 76.1206, 7.76744, 95.5392, 19.4186, 91.6555, -3.88373, 113.404, 21.7487, 108.744, -4.66022, 126.609, 17.8648, 131.269, 4.66027, 128.939, -2.32995, 120.395, -8.5441, 187.195, 66.7996, 166.223, -20.9724, 181.757, 15.5345, 184.864, 3.10742, 182.534, -2.3298, 196.516, 13.9815, 222.925, 26.4087, 187.971, -34.9536, 197.292, 9.32128, 182.534, -14.7578, 166.999, -15.5346, 166.999, 0.00037084, 173.99, 6.99104, 156.125, -17.865, 139.813, -16.3116, 132.823, -6.99024, 121.948, -10.8746, 132.046, 10.098, 132.046, 0.0000141522, 112.627, -19.4185, 108.744, -3.88322, 104.86, -3.88393, 90.8787, -13.9813, 95.5392, 4.66047, 108.744, 13.2046, 107.967, -0.776965, 107.967, 0.0000351009, 90.8787, -17.0883, 90.8787, 0.0000273871, 87.7718, -3.10694, 84.6648, -3.107, 64.4695, -20.1953, 62.916, -1.55346, 41.1673, -21.7487, 59.0323, 17.865, 55.1486, -3.88367, 48.158, -6.99064, 40.3905, -7.76745, 35.7301, -4.6604, 35.7301, -0.00000205293, 39.6138, 3.8837, 24.079, -15.5348, 24.8557, 0.77672, 24.079, -0.776721, 27.9627, 3.88369, 32.6231, 4.66043, 33.3999, 0.776774, 31.0697, -2.33025, 28.7394, -2.33027, 24.079, -4.66042, 25.6325, 1.55346, 18.6418, -6.99071, 14.7581, -3.88372, 13.2046, -1.5535, 12.4279, -0.77674, 10.8744, -1.55352, 13.2046, 2.3302, 15.5348, 2.33023, 15.5348, 0.0000251944, 14.7581, -0.776716, 17.865, 3.10695, 16.3116, -1.55343, 16.3116, -0.0000335459, 14.7581, -1.55352, 11.6511, -3.10698, 13.2046, 1.5535, 10.8744, -2.33022, 10.0976, -0.776764, 8.544, -1.553]
  var data1 = [];
  var data2 = [];
  for (let i = 0; i < raw_data.length; i++) {
    if (i % 2 == 0) {
      data1.push(raw_data[i]);
    } else {
      data2.push(raw_data[i]);
    }
  }

  let tmp = [];
  for (let i = -100; i < 101; i++) {
    tmp.push(i / 10);
  }

  datasets.add(new DataSet(tmp, false, "", "R"));
  datasets.add(new DataSet(data1));
  datasets.add(new DataSet(data2));

  updateDropdown();
}