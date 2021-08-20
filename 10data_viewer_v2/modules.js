var tempSet = {};
var slot_offset = { 0: 0, 1: 0, 2: 0, 3: 0 };

function Min_Max(data, nDigits) {
  if (data.type == "number") {
    let min = Math.min(...data.values);
    let max = Math.max(...data.values);

    var min_maxTable = [["Min", "Index"], [Number(min.toFixed(nDigits)), data.values.indexOf(min)], ["<hr>", "<hr>"], ["Max", "Index"], [Number(max.toFixed(nDigits)), data.values.indexOf(max)]]

    return [min_maxTable, null, data.name, ""];
  }
  return false;
}

function xFlip(data, nDigits) {
  var xflipTable = [["Index", "Value", "xFlip"]];
  var tmp = [];

  for (let i = 0; i < data.len; i++) {
    if (data.type == "number") {
      tmp.push(Number(data.values[data.len - 1 - i].toFixed(nDigits)));
    } else {
      tmp.push(data.values[data.len - 1 - i]);
    }
  }

  for (let i = 0; i < tmp.length; i++) {
    xflipTable.push([i, data.values[i], tmp[i]]);
  }

  return [xflipTable, tmp, data.name, ""];
}

function Cut(data, nDigits) {
  var start = document.getElementById("cut_start").value;
  var end = document.getElementById("cut_end").value;
  var replaceNaN = document.getElementById("cut_nan").checked;

  var cutTable = [["Index", "Value", "Cut"]];
  var tmp = [];

  if (start == "") {
    start = 0;
  } else {
    start = parseInt(start);
  }

  if (end == "") {
    end = data.len - 1;
  } else {
    end = parseInt(end);
  }

  let xOffset = 0;
  if (start < 0) {
    for (let i = start; i < 0; i++) {
      tmp.push(NaN);
      xOffset = -1 * start;
    }
  }

  for (let i = 0; i < data.len; i++) {
    if (i < start) {
      if (replaceNaN == true) {
        tmp.push(NaN);
      }
    } else if (i >= start && i <= end) {
      if (data.type == "number") {
        tmp.push(Number(data.values[i].toFixed(nDigits)));
      } else {
        tmp.push(data.values[i]);
      }
    }
  }

  for (let i = 0; i < data.len + xOffset; i++) {
    cutTable.push([i, data.values[i], tmp[i]]);
  }

  return [cutTable, tmp, data.name, start + "," + end];
}

function Delta(data, nDigits) {
  var tmp = [];
  var deltaTable = [["Index", "Value", "Delta"]];

  if (data.type == "number") {
    for (let i = 0; i < data.len; i++) {
      if (i == 0) {
        tmp.push(NaN);
      } else {
        tmp.push(Number((data.values[i] - data.values[i - 1]).toFixed(nDigits)));
      }
    }

    for (let i = 0; i < tmp.length; i++) {
      deltaTable.push([i, data.values[i], tmp[i]]);
    }

    return [deltaTable, tmp, data.name, ""];
  }
  return false;
}

function Abs(data, nDigits) {
  var tmp = [];
  var absTable = [["Index", "Value", "Abs"]];

  if (data.type == "number") {
    for (let i = 0; i < data.len; i++) {
      tmp.push(Number(Math.abs(data.values[i]).toFixed(nDigits)));
    }

    for (let i = 0; i < tmp.length; i++) {
      absTable.push([i, data.values[i], tmp[i]]);
    }

    return [absTable, tmp, data.name, ""];
  }
  return false;
}

function Log(data, nDigits, n, datasetData, minLen) {
  var useDefault = false;
  if (n == "") {
    n = Math.E;
    useDefault = true;
  } else {
    n = Number(n);
  }

  var tmp = [];
  var logTable = [["Index", "Value", "Log"]];

  if (data.type == "number") {
    if (useDefault == false || datasetData == undefined || datasetData.type != "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number((Math.log(data.values[i]) / Math.log(n)).toFixed(nDigits)));
      }

    } else if (datasetData != undefined && datasetData.type == "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number(Math.log(data.values[i] / Math.log(datasetData.values[i])).toFixed(nDigits)));
      }
      n = datasetData.name;
    }

    for (let i = 0; i < tmp.length; i++) {
      logTable.push([i, data.values[i], tmp[i]]);
    }

    return [logTable, tmp, data.name, n];
  }
  return false;
}

function Exp(data, nDigits, n, datasetData, minLen) {
  var useDefault = false;
  if (n == "") {
    n = Math.E;
    useDefault = true;
  } else {
    n = Number(n);
  }

  var tmp = [];
  var expTable = [["Index", "Value", "Exp"]];

  if (data.type == "number") {
    if (useDefault == false || datasetData == undefined || datasetData.type != "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number(Math.pow(n, data.values[i]).toFixed(nDigits)));
      }

    } else if (datasetData != undefined && datasetData.type == "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number(Math.pow(datasetData.values[i], data.values[i]).toFixed(nDigits)));
      }
      n = datasetData.name;
    }

    for (let i = 0; i < tmp.length; i++) {
      expTable.push([i, data.values[i], tmp[i]]);
    }

    return [expTable, tmp, data.name, n];
  }
  return false;
}

function Root(data, nDigits, n, datasetData, minLen) {
  var useDefault = false;
  if (n == "") {
    n = 2;
    useDefault = true;
  } else {
    n = Number(n);
  }

  var tmp = [];
  var rootTable = [["Index", "Value", "Root"]];

  if (data.type == "number") {
    if (useDefault == false || datasetData == undefined || datasetData.type != "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number(Math.pow(data.values[i], 1 / parseInt(n)).toFixed(nDigits)));
      }

    } else if (datasetData != undefined && datasetData.type == "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number(Math.pow(data.values[i], 1 / parseInt(datasetData.values[i])).toFixed(nDigits)));
      }
      n = datasetData.name;
    }

    for (let i = 0; i < tmp.length; i++) {
      rootTable.push([i, data.values[i], tmp[i]]);
    }

    return [rootTable, tmp, data.name, n];
  }
  return false;
}

function Add_Sub(data, nDigits, n, datasetData, minLen) {
  var useDefault = false;
  if (n == "") {
    n = 1;
    useDefault = true;
  } else {
    n = Number(n);
  }

  var tmp = [];
  var add_subTable = [["Index", "Value", "Add/Sub"]];

  if (data.type == "number") {
    if (useDefault == false || datasetData == undefined || datasetData.type != "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number((data.values[i] + n).toFixed(nDigits)));
      }

    } else if (datasetData != undefined && datasetData.type == "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number((data.values[i] + datasetData.values[i]).toFixed(nDigits)));
      }
      n = datasetData.name;
    }

    for (let i = 0; i < tmp.length; i++) {
      add_subTable.push([i, data.values[i], tmp[i]]);
    }

    return [add_subTable, tmp, data.name, n];
  }
  return false;
}

function Mul(data, nDigits, n, datasetData, minLen) {
  var useDefault = false;
  if (n == "") {
    n = -1;
    useDefault = true;
  } else {
    n = Number(n);
  }

  var tmp = [];
  var mulTable = [["Index", "Value", "Mul"]];

  if (data.type == "number") {
    if (useDefault == false || datasetData == undefined || datasetData.type != "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number((data.values[i] * n).toFixed(nDigits)));
      }

    } else if (datasetData != undefined && datasetData.type == "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number((data.values[i] * datasetData.values[i]).toFixed(nDigits)));
      }
      n = datasetData.name;
    }

    for (let i = 0; i < tmp.length; i++) {
      mulTable.push([i, data.values[i], tmp[i]]);
    }

    return [mulTable, tmp, data.name, n];
  }
  return false;
}

function Div(data, nDigits, n, datasetData, minLen) {
  var useDefault = false;
  if (n == "") {
    n = 1;
    useDefault = true;
  } else {
    n = Number(n);
  }

  var tmp = [];
  var divTable = [["Index", "Value", "Div"]];

  if (data.type == "number") {
    if (useDefault == false || datasetData == undefined || datasetData.type != "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number((data.values[i] / n).toFixed(nDigits)));
      }

    } else if (datasetData != undefined && datasetData.type == "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number((data.values[i] / datasetData.values[i]).toFixed(nDigits)));
      }
      n = datasetData.name;
    }

    for (let i = 0; i < tmp.length; i++) {
      divTable.push([i, data.values[i], tmp[i]]);
    }

    return [divTable, tmp, data.name, n];
  }
  return false;
}

function Pow(data, nDigits, n, datasetData, minLen) {
  var useDefault = false;
  if (n == "") {
    n = 2;
    useDefault = true;
  } else {
    n = Number(n);
  }

  var tmp = [];
  var powTable = [["Index", "Value", "Pow"]];

  if (data.type == "number") {
    if (useDefault == false || datasetData == undefined || datasetData.type != "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number(Math.pow(data.values[i], n).toFixed(nDigits)));
      }

    } else if (datasetData != undefined && datasetData.type == "number") {
      for (let i = 0; i < minLen; i++) {
        tmp.push(Number(Math.pow(data.values[i], datasetData.values[i]).toFixed(nDigits)));
      }
      n = datasetData.name;
    }

    for (let i = 0; i < tmp.length; i++) {
      powTable.push([i, data.values[i], tmp[i]]);
    }

    return [powTable, tmp, data.name, n];
  }
  return false;
}

function Gaussian_Average(data, nDigits, n) {
  var index = [-2, 3];
  function mk(a, i) {
    var tmpKernel = [];
    var kernel = [];
    var s = 0;

    for (let x = i[0]; x < i[1]; x++) {
      let tmp = 1 / (Math.sqrt(Math.PI) * a) * Math.exp(-Math.pow(x / 2, 2) / Math.pow(a, 2));
      tmpKernel.push(tmp);
      s += tmp;
    }

    tmpKernel.forEach(value => {
      kernel.push(value * 1 / s);
    });

    return kernel;
  }

  if (n == "") {
    n = 1;
  } else {
    n = parseInt(n);
  }

  var Kernel = mk(n, index);

  var tmp = [];
  var g_aTable = [["Index", "Value", "GA"]];

  if (data.type == "number") {
    for (let i = 0; i < data.len; i++) {
      if (i > 1 && i < data.len - 2) {
        var tmpValue = 0;
        for (let j = index[0]; j < index[1]; j++) {
          tmpValue += data.values[i + j] * Kernel[j + 2]
        }
        tmp.push(Number(tmpValue.toFixed(nDigits)));
      } else {
        tmp.push(NaN);
      }

    }

    for (let i = 0; i < tmp.length; i++) {
      g_aTable.push([i, data.values[i], tmp[i]]);
    }

    return [g_aTable, tmp, data.name, n];
  }
  return false;
}

function GetIndex(data, nDigits, n) {
  if (n == "") {
    n = 0;
  } else {
    n = Number(n);
  }

  if (data.type == "number") {
    var indexTable = [["Index", "Value"], [n, Number(data.values[n].toFixed(nDigits))]];
  } else {
    var indexTable = [["Index", "Value"], [n, data.values[n]]];
  }

  return [indexTable, null, data.name, n];
}

//Noise Generator
function Ngen(data, nDigits, n) {
  if (n == "") {
    n = 1;
  } else {
    n = Number(n);
  }

  var tmp = [];
  var noiseTable = [["Index", "Value", "Noise"]];

  if (data.type == "number") {
    for (let i = 0; i < data.len; i++) {
      tmp.push(Number((data.values[i] + Math.random() * n * 2 - n).toFixed(nDigits)));
    }

    for (let i = 0; i < tmp.length; i++) {
      noiseTable.push([i, data.values[i], tmp[i]]);
    }

    return [noiseTable, tmp, data.name, n];
  }
  return false;
}

//Function Generator
function Fgen(nDigits) {
  let x_data_index = document.getElementById("molule_Ix_gen").selectedIndex;
  var x_data = null;

  if (x_data_index != 0) {
    x_data = datasets.dataSet_list[x_data_index - 1];
  }

  let type = document.getElementById("molule_fGen_types").value;
  let type_label = document.getElementById("gen_function");

  let max_y = document.getElementById("max_y").value;
  let x_interval = document.getElementById("x_interval").value;

  let a = document.getElementById("gen_a").value;
  let b = document.getElementById("gen_b").value;
  let c = document.getElementById("gen_c").value;
  let d = document.getElementById("gen_d").value;
  let e = document.getElementById("gen_e").value;

  if (a == "") {
    a = 1;
  } else {
    a = Number(a);
  }

  if (b == "") {
    b = 1;
  } else {
    b = Number(b);
  }

  if (c == "") {
    c = 1;
  } else {
    c = Number(c);
  }

  if (d == "") {
    d = 0;
  } else {
    d = Number(d);
  }

  if (e == "") {
    e = 0;
  } else {
    e = Number(e);
  }

  if (max_y == "") {
    max_y = Infinity;
  } else {
    max_y = Number(max_y);
  }

  var x_interval_set = false;
  if (x_interval == "") {
    x_interval = [0, 100, 1];
  } else {
    x_interval = x_interval.split(",");

    if (x_interval.length == 1) {
      x_interval.push(100);
    }
    if (x_interval.length == 2) {
      x_interval.push(1);
    }

    if (x_interval[2] < 0.001) {
      x_interval[2] = 0.001;
    }
    x_interval_set = true;
  }

  x = [];
  if (x_data == null) {
    for (let i = Number(x_interval[0]); i < Number(x_interval[1]); i += Number(x_interval[2])) {
      x.push(Number(i.toFixed(nDigits)));
    }

  } else {
    x_data.values.forEach(value => {
      if (x_interval_set == true) {
        if (value >= Number(x_interval[0]) && value <= Number(x_interval[1])) {
          x.push(value);
        }
      } else {
        x.push(value);
      }
    });
  }

  var tmp = [];
  var genTable = [["Index", "x", "y"]];

  if (type == "Linear") {
    document.getElementsByName("gen_ps").forEach(element => {
      element.style.display = "none";
    });

    genTable = [["Index", "x"]];

    x.forEach(n => {
      tmp.push(Number((n).toFixed(nDigits)));
    });

  } else {
    document.getElementsByName("gen_ps").forEach(element => {
      element.style.display = "block";
    });
  }

  if (type == "Poly") {
    type_label.innerText = "y = ax^4 + bx^3 + cx^2 + dx + e";
    x.forEach(n => {
      tmp.push(Number((a * Math.pow(n, 4) + b * Math.pow(n, 3) + c * Math.pow(n, 2) + d * n + e).toFixed(nDigits)));
    });

  } else if (type == "Exp") {
    type_label.innerText = "y= a * b^[c * (x - d)] + e";
    x.forEach(n => {
      tmp.push(Number((a * Math.pow(b, (c * (n - d))) + e).toFixed(nDigits)));
    });

  } else if (type == "Log") {
    type_label.innerText = "y= a * log(b, [c * (x - d)]) + e";
    x.forEach(n => {
      tmp.push(Number((a * Math.log(c * (n - d)) / Math.log(b) + e).toFixed(nDigits)));
    });

  } else if (type == "Sin") {
    type_label.innerText = "y= a * sin[b * (x - c)] + d";
    x.forEach(n => {
      tmp.push(Number((a * Math.sin(b * (n - c)) + d).toFixed(nDigits)));
    });

  } else if (type == "Cos") {
    type_label.innerText = "y= a * cos[b * (x - c)] + d";
    x.forEach(n => {
      tmp.push(Number((a * Math.cos(b * (n - c)) + d).toFixed(nDigits)));
    });

  } else if (type == "Tan") {
    type_label.innerText = "y= a * tan[b * (x - c)] + d";
    x.forEach(n => {
      tmp.push(Number((a * Math.tan(b * (n - c)) + d).toFixed(nDigits)));
    });

  }

  for (let i = 0; i < tmp.length; i++) {
    if (tmp[i] >= max_y || tmp[i] <= -1 * max_y) {
      tmp[i] = NaN;
    }

    if (type == "Linear") {
      genTable.push([i, tmp[i]]);
    } else {
      genTable.push([i, x[i], tmp[i]]);
    }
  }

  let ret = [genTable, tmp, "Fgen(" + type + ")", a + "," + b + "," + c + "," + d + "," + e];

  if (Number(x_interval[2]) != 1) {
    ret.push(x)
  }

  return ret;
}

//Calculator
var calcs = [""];
function Calc(element) {
  var solution = undefined;
  var pressed = undefined;
  var lastOp = undefined;

  if (element != false) {
    pressed = element.id.split("_")[1];
  }

  if (isNaN(Number(pressed)) == false) {
    calcs[calcs.length - 1] = Number(calcs[calcs.length - 1] + pressed).toString();

  } else if (pressed == "k" && calcs[calcs.length - 1].includes(".") == false) {
    calcs[calcs.length - 1] += ".";

  } else if (["div", "mul", "min", "plus", "perc", "pm"].includes(pressed)) {

    if (pressed == "perc") {
      calcs[calcs.length - 1] = (Number(calcs[calcs.length - 1]) / 100).toString();

    } else if (pressed == "pm") {
      calcs[calcs.length - 1] = (Number(calcs[calcs.length - 1]) * -1).toString();

    } else {
      calcs.push(pressed);
      lastOp = pressed;
      calcs.push("");
    }

  } else if (pressed == "ac") {
    calcs = ["0"];

  } else if (pressed == "eq" && calcs.length > 2) {
    solution = 0;

    for (let i = 0; i < calcs.length; i++) {
      if (i == 0) {
        solution = Number(calcs[i]);
      } else {
        if (calcs[i] == "mul") {
          solution *= Number(calcs[i + 1]);
        } else if (calcs[i] == "div") {
          solution /= Number(calcs[i + 1]);
        } else if (calcs[i] == "min") {
          solution -= Number(calcs[i + 1]);
        } else if (calcs[i] == "plus") {
          solution += Number(calcs[i + 1]);
        }
      }
    }
  }

  ["div", "mul", "min", "plus"].forEach(element => {
    document.getElementById("calc_" + element).style = "";
  });

  if (lastOp != undefined) {
    document.getElementById("calc_" + lastOp).style = "background-color: #A3A3A3;";
  }

  var tmp = "";
  for (let i = 0; i < calcs.length; i++) {
    if (isNaN(Number(calcs[i])) == false) {
      tmp = calcs[i];
    }
  }

  if (solution != undefined) {
    tmp = solution;
    calcs = [solution.toString()];
  }

  if (tmp == NaN) {
    tmp = 0;
  }
  document.getElementById("calc_out").value = tmp;
}

//updates slot offset; otherwise wrong match of document.getElementsByName(), if no module is present in the slot to the left
function update_slot_offset() {
  slot_offset = { 0: 0, 1: 0, 2: 0, 3: 0 };

  if (document.getElementsByName("module0").length == 0) {
    slot_offset[1] += 1;
    slot_offset[2] += 1;
    slot_offset[3] += 1;
  }

  if (document.getElementsByName("module1").length == 0) {
    slot_offset[2] += 1;
    slot_offset[3] += 1;
  }

  if (document.getElementsByName("module2").length == 0) {
    slot_offset[3] += 1;
  }
}

//copies a module to a slot
function show_Module(name, id, simple_mod = false) {
  update_slot_offset()
  let element_name = name;
  if (simple_mod == true) {
    element_name = "simple_mod";
  }

  let newDiv = document.getElementById(element_name);
  let copy = newDiv.cloneNode(true);
  copy.style = "display: block";

  if (simple_mod == false) {
    copy.id += id.toString();
  } else {
    copy.id = name + id.toString();
  }

  copy.setAttribute("name", "module" + id.toString());

  document.getElementById("bottom_item_main" + id.toString()).appendChild(copy);

  if (name == "calculator") {
    document.getElementById("calc_out").value = 0;
  }

  if (simple_mod == true) {
    let mod_text = document.getElementsByName("mod_text")[id - slot_offset[id]];
    let mod_main = document.getElementsByName("mod_main")[id - slot_offset[id]];
    let mod_input = document.getElementsByName("mod_input")[id - slot_offset[id]];
    let mod_inputDataset = document.getElementsByName("molule_Idataset")[id - slot_offset[id]];
    let saveSet = document.getElementsByName("IO_footer")[id - slot_offset[id]];
    let txt = "Input a; ";

    if (["min_max", "index"].includes(name)) {
      //Hide Footer For ^ Modules
      saveSet.style.display = "none";
    }

    if (["delta", "xflip", "abs", "min_max"].includes(name)) {
      //Hide Mod Input For ^ Modules
      mod_main.style = "display: none;";

    } else if (name == "log") {
      mod_text.innerText = "Logₐ(x)";
      mod_input.setAttribute("placeholder", txt + "def. e");
      mod_inputDataset.style = "";

    } else if (name == "exp") {
      mod_text.innerText = "aᵡ";
      mod_input.setAttribute("placeholder", txt + "def. e");
      mod_inputDataset.style = "";

    } else if (name == "root") {
      mod_text.innerText = "ᵃ√x";
      mod_input.setAttribute("placeholder", txt + "def. 2");
      mod_inputDataset.style = "";

    } else if (name == "add_sub") {
      mod_text.innerText = "x + a";
      mod_input.setAttribute("placeholder", txt + "def. 1");
      mod_inputDataset.style = "";

    } else if (name == "mul") {
      mod_text.innerText = "x * a";
      mod_input.setAttribute("placeholder", txt + "def. -1");
      mod_inputDataset.style = "";

    } else if (name == "div") {
      mod_text.innerText = "x / a";
      mod_input.setAttribute("placeholder", txt + "def. 1");
      mod_inputDataset.style = "";

    } else if (name == "pow") {
      mod_text.innerText = "xᵃ";
      mod_input.setAttribute("placeholder", txt + "def. 2");
      mod_inputDataset.style = "";

    } else if (name == "gaussian_average") {
      mod_text.innerText = "a";
      mod_input.setAttribute("placeholder", txt + "def. 1");

    } else if (name == "noise_gen") {
      mod_text.innerText = "+-a";
      mod_input.setAttribute("placeholder", txt + "def. 1");

    } else if (name == "index") {
      mod_text.innerText = "Values[a]";
      mod_input.setAttribute("placeholder", txt + "def. 0");
    }
  }
}

//saves Values from tempSet to a new Dataset
function save_Set(element) {
  update_slot_offset();
  let parent = element.parentElement.parentElement;
  let id = parent.id[parent.id.length - 1];
  let operation = parent.id.substring(0, parent.id.length - 1);
  let n = 1;
  if (tempSet[operation] != undefined) {
    let tmp = new DataSet(tempSet[operation], false, operation, document.getElementsByName("save_Input")[id - slot_offset[id]].value,
      document.getElementsByName("mod_parent")[id - slot_offset[id]].innerText,
      document.getElementsByName("mod_param")[id - slot_offset[id]].innerText);

    datasets.add(tmp);

    if (operation == "function_gen") {
      if (tempSet["xValues"] != undefined) {
        n = 2;
        datasets.add(new DataSet(tempSet["xValues"], true, "xValues(fgen)", "xValues" + tmp.id, tmp.name));
        delete tempSet["xValues"];
      }
    }
  }

  updateDropdown(n);
}

//onchange of every input/dropdown inside a module
function selected_Module(element, depth = false) {
  update_slot_offset();

  let parent;
  if (depth == false) {
    parent = element.parentElement.parentElement;
  } else {
    parent = element.parentElement.parentElement.parentElement;
  }

  let id = parent.id[parent.id.length - 1];
  let operation = parent.id.substring(0, parent.id.length - 1);

  element = document.getElementsByName("module_I")[id - slot_offset[id]];
  let n = document.getElementsByName("mod_input")[id - slot_offset[id]].value;

  let data = datasets.dataSet_list[element.selectedIndex - 1];
  let nDigits = document.getElementsByName("molule_IN")[id - slot_offset[id]].value;

  let datasetInput = document.getElementsByName("molule_Idataset")[id - slot_offset[id]];
  let datasetData = datasets.dataSet_list[datasetInput.selectedIndex - 1];

  if (nDigits == "") {
    nDigits = 4;
  }

  var minLen = data.len;
  if (datasetData != undefined) {
    if (datasetData.len < minLen) {
      minLen = datasetData.len;
    }
  }

  //element => Module Input Dropdown HTML element
  //data => selected data with the Input Dropdown
  //nDigits => Round to n Digits
  //n => mod Parameter
  //datasetData => selected data with the Selcond Input Dropdown
  //minLen => len of shortest dataset
  var returned = [];
  if (data != undefined || operation == "function_gen") {
    if (operation == "min_max") {
      returned = Min_Max(data, nDigits);

    } else if (operation == "delta") {
      returned = Delta(data, nDigits);

    } else if (operation == "abs") {
      returned = Abs(data, nDigits);

    } else if (operation == "log") {
      returned = Log(data, nDigits, n, datasetData, minLen);

    } else if (operation == "exp") {
      returned = Exp(data, nDigits, n, datasetData, minLen);

    } else if (operation == "root") {
      returned = Root(data, nDigits, n, datasetData, minLen);

    } else if (operation == "add_sub") {
      returned = Add_Sub(data, nDigits, n, datasetData, minLen);

    } else if (operation == "mul") {
      returned = Mul(data, nDigits, n, datasetData, minLen);

    } else if (operation == "div") {
      returned = Div(data, nDigits, n, datasetData, minLen);

    } else if (operation == "pow") {
      returned = Pow(data, nDigits, n, datasetData, minLen);

    } else if (operation == "gaussian_average") {
      returned = Gaussian_Average(data, nDigits, n);

    } else if (operation == "cut") {
      returned = Cut(data, nDigits);

    } else if (operation == "n-fit") {
      returned = Fit(nDigits);

    } else if (operation == "xflip") {
      returned = xFlip(data, nDigits);

    } else if (operation == "function_gen") {
      returned = Fgen(nDigits);

    } else if (operation == "noise_gen") {
      returned = Ngen(data, nDigits, n);

    } else if (operation == "index") {
      returned = GetIndex(data, nDigits, n);

    } else {
      console.log(operation);
    }

    if (returned.length != 0 && returned != false) {
      document.getElementsByName("mod_out")[id - slot_offset[id]].innerHTML = makeTableHTML(returned[0]);
      document.getElementsByName("mod_parent")[id - slot_offset[id]].innerText = returned[2];
      document.getElementsByName("mod_param")[id - slot_offset[id]].innerText = returned[3];
      if (returned[1] != null) {
        tempSet[operation] = returned[1];
      }

      if (returned[4] != undefined) {
        tempSet["xValues"] = returned[4];
      }
    } else if (returned == false) {
      document.getElementsByName("mod_out")[id - slot_offset[id]].innerHTML = "<label style='font-size: larger; color: red;'>Dataset is not type = number!</label>";
    }
  }
}