var tempSet = {};
var slot_offset = { 0: 0, 1: 0, 2: 0, 3: 0 };

function Min_Max(element) {
  let data = datasets.dataSet_list[element.selectedIndex - 1]
  if (element.selectedIndex == 0 || data.type != "number") {
    document.getElementById("min_out").innerText = "";
    document.getElementById("min_index_out").innerText = "";

    document.getElementById("max_out").innerText = "";
    document.getElementById("max_index_out").innerText = "";

  } else if (element.selectedIndex != 0) {
    if (data.type == "number") {
      let min = Math.min(...data.values);
      let max = Math.max(...data.values);

      document.getElementById("min_out").innerText = min.toString();
      document.getElementById("min_index_out").innerText = data.values.indexOf(min).toString();

      document.getElementById("max_out").innerText = max.toString();
      document.getElementById("max_index_out").innerText = data.values.indexOf(max).toString();
    }
  }

  return [];
}

function xFlip(element, data) {
  if (element.selectedIndex != 0) {
    var xflipTable = [["Index", "Value", "xFlip"]];
    var tmp = [];

    for (let i = 0; i < data.len; i++) {
      tmp.push(data.values[data.len - 1 - i]);
    }

    for (let i = 0; i < tmp.length; i++) {
      xflipTable.push([i, data.values[i], tmp[i]]);
    }

    return [xflipTable, tmp, data.name, ""];
  }
}

function Cut(element, data) {
  if (element.selectedIndex != 0) {
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

    for (let i = 0; i < data.len; i++) {
      if (i < start) {
        if (replaceNaN == true) {
          tmp.push(NaN);
        }
      } else if (i >= start && i <= end) {
        tmp.push(data.values[i]);
      }
    }

    for (let i = 0; i < data.len; i++) {
      if (tmp[i] == undefined) {
        cutTable.push([i, data.values[i], ""]);
      } else {
        cutTable.push([i, data.values[i], tmp[i]]);
      }
    }

    return [cutTable, tmp, data.name, start + "," + end];
  }
}

function Delta(element, data, nDigits) {
  if (element.selectedIndex != 0) {
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
  }
}

function Abs(element, data, nDigits) {
  if (element.selectedIndex != 0) {
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
  }
}

function Log(element, data, nDigits, n, datasetData) {
  if (element.selectedIndex != 0) {
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
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number((Math.log(data.values[i]) / Math.log(n)).toFixed(nDigits)));
        }

      } else if (datasetData != undefined && datasetData.type == "number") {
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number(Math.log(data.values[i] / Math.log(datasetData.values[i])).toFixed(nDigits)));
        }
        n = datasetData.name;
      }

      for (let i = 0; i < tmp.length; i++) {
        logTable.push([i, data.values[i], tmp[i]]);
      }

      return [logTable, tmp, data.name, n];
    }
  }
}

function Exp(element, data, nDigits, n, datasetData) {
  if (element.selectedIndex != 0) {
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
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number(Math.pow(n, data.values[i]).toFixed(nDigits)));
        }

      } else if (datasetData != undefined && datasetData.type == "number") {
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number(Math.pow(datasetData.values[i], data.values[i]).toFixed(nDigits)));
        }
        n = datasetData.name;
      }

      for (let i = 0; i < tmp.length; i++) {
        expTable.push([i, data.values[i], tmp[i]]);
      }

      return [expTable, tmp, data.name, n];
    }
  }
}

function Root(element, data, nDigits, n, datasetData) {
  if (element.selectedIndex != 0) {
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
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number(Math.pow(data.values[i], 1 / parseInt(n)).toFixed(nDigits)));
        }

      } else if (datasetData != undefined && datasetData.type == "number") {
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number(Math.pow(data.values[i], 1 / parseInt(datasetData.values[i])).toFixed(nDigits)));
        }
        n = datasetData.name;
      }

      for (let i = 0; i < tmp.length; i++) {
        rootTable.push([i, data.values[i], tmp[i]]);
      }

      return [rootTable, tmp, data.name, n];
    }
  }
}

function Add_Sub(element, data, nDigits, n, datasetData) {
  if (element.selectedIndex != 0) {
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
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number((data.values[i] + n).toFixed(nDigits)));
        }

      } else if (datasetData != undefined && datasetData.type == "number") {
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number((data.values[i] + datasetData.values[i]).toFixed(nDigits)));
        }
        n = datasetData.name;
      }

      for (let i = 0; i < tmp.length; i++) {
        add_subTable.push([i, data.values[i], tmp[i]]);
      }

      return [add_subTable, tmp, data.name, n];
    }
  }
}

function Mul(element, data, nDigits, n, datasetData) {
  if (element.selectedIndex != 0) {
    var useDefault = false;
    if (n == "") {
      n = -1;
      useDefault = true;
    } else {
      n = Number(n);
    }

    var tmp = [];
    var mul_divTable = [["Index", "Value", "Mul"]];

    if (data.type == "number") {
      if (useDefault == false || datasetData == undefined || datasetData.type != "number") {
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number((data.values[i] * n).toFixed(nDigits)));
        }

      } else if (datasetData != undefined && datasetData.type == "number") {
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number((data.values[i] * datasetData.values[i]).toFixed(nDigits)));
        }
        n = datasetData.name;
      }

      for (let i = 0; i < tmp.length; i++) {
        mul_divTable.push([i, data.values[i], tmp[i]]);
      }

      return [mul_divTable, tmp, data.name, n];
    }
  }
}

function Pow(element, data, nDigits, n, datasetData) {
  if (element.selectedIndex != 0) {
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
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number(Math.pow(data.values[i], n).toFixed(nDigits)));
        }

      } else if (datasetData != undefined && datasetData.type == "number") {
        for (let i = 0; i < data.len; i++) {
          tmp.push(Number(Math.pow(data.values[i], datasetData.values[i]).toFixed(nDigits)));
        }
        n = datasetData.name;
      }

      for (let i = 0; i < tmp.length; i++) {
        powTable.push([i, data.values[i], tmp[i]]);
      }

      return [powTable, tmp, data.name, n];
    }
  }
}

function Gaussian_Average(element, data, nDigits, n) {
  if (element.selectedIndex != 0) {
    var index = [-2, 3];
    function mk(a, i) {
      var tmpKernel = [];
      var kernel = [];
      var s = 0;

      for (let x = i[0]; x < i[1]; x++) {
        let tmp = 1 / (Math.sqrt(Math.PI) * a) * Math.exp(-Math.pow(x / 2, 2) / Math.pow(a, 2));
        tmpKernel.push(tmp);
        s += tmp;
        console.log(s);
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
  }
}

//Noise Generator
function Ngen(element, data, nDigits, n) {
  if (element.selectedIndex != 0) {
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
  }
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

    genTable.push([i, x[i], tmp[i]]);
  }

  return [genTable, tmp, "Fgen(" + type + ")", a + "," + b + "," + c + "," + d + "," + e];
}

//Calculator
var calcs = [""];
function Calc(element) {
  var solution = "";
  var pressed = undefined;

  if (element != false) {
    pressed = element.id.split("_")[1];
  }

  if (isNaN(Number(pressed)) == false) {
    calcs[calcs.length - 1] += pressed;

  } else if (pressed == "k" && calcs[calcs.length - 1].includes(".") == false) {
    calcs[calcs.length - 1] += ".";

  } else if (["div", "mul", "min", "plus", "perc", "pm"].includes(pressed)) {

    if (pressed == "perc") {
      calcs[calcs.length - 1] = (Number(calcs[calcs.length - 1]) / 100).toString();

    } else if (pressed == "pm") {
      calcs[calcs.length - 1] = (Number(calcs[calcs.length - 1]) * 100).toString();

    } else {
      calcs.push(pressed);
      calcs.push("");
    }

  } else if (pressed == "ac") {
    calcs = [""];

  } else if (pressed == "eq" && calcs.length > 2) {
    calcs[calcs.length - 1] = calcs[calcs.length - 1];
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

  var tmp = "";
  for (let i = 0; i < calcs.length; i++) {
    if (isNaN(Number(calcs[i])) == false) {
      tmp = calcs[i];
    }
  }

  if (solution != "") {
    tmp = solution;
    calcs = [solution.toString()];
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

  if (simple_mod == true) {
    let mod_text = document.getElementsByName("mod_text")[id - slot_offset[id]];
    let mod_main = document.getElementsByName("mod_main")[id - slot_offset[id]];
    let mod_input = document.getElementsByName("mod_input")[id - slot_offset[id]];
    let mod_inputDataset = document.getElementsByName("molule_Idataset")[id - slot_offset[id]];
    let txt = "Input a; ";

    if (["delta", "xflip", "abs"].includes(name)) {
      //Hide Input Bar For ^ Modules
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

    } else if (name == "pow") {
      mod_text.innerText = "xᵃ";
      mod_input.setAttribute("placeholder", txt + "def. 2");
      mod_inputDataset.style = "";

    } else if (name == "gaussian_average") {
      mod_text.innerText = "a =";
      mod_input.setAttribute("placeholder", txt + "def. 1");

    } else if (name == "noise_gen") {
      mod_text.innerText = "+-a";
      mod_input.setAttribute("placeholder", txt + "def. 1");
    }
  }
}

function save_Set(element) {
  update_slot_offset();
  let parent = element.parentElement.parentElement;
  let id = parent.id[parent.id.length - 1];
  let operation = parent.id.substring(0, parent.id.length - 1);

  if (tempSet[operation] != undefined) {
    datasets.add(new DataSet(tempSet[operation], false, operation, document.getElementsByName("save_Input")[id - slot_offset[id]].value,
      document.getElementsByName("mod_parent")[id - slot_offset[id]].innerText,
      document.getElementsByName("mod_param")[id - slot_offset[id]].innerText));
  }

  updateDropdown(true);
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
  //element => Module Input Dropdown HTML element
  //data => selected data with the Input Dropdown
  //nDigits => Round to n Digits
  //n => mod Parameter
  //datasetData => selected data with the Selcond Input Dropdown
  var returned = [];
  if (data != undefined || operation == "function_gen") {
    if (operation == "min_max") {
      returned = Min_Max(element);

    } else if (operation == "delta") {
      returned = Delta(element, data, nDigits);

    } else if (operation == "abs") {
      returned = Abs(element, data, nDigits);

    } else if (operation == "log") {
      returned = Log(element, data, nDigits, n, datasetData);

    } else if (operation == "exp") {
      returned = Exp(element, data, nDigits, n, datasetData);

    } else if (operation == "root") {
      returned = Root(element, data, nDigits, n, datasetData);

    } else if (operation == "add_sub") {
      returned = Add_Sub(element, data, nDigits, n, datasetData);

    } else if (operation == "mul") {
      returned = Mul(element, data, nDigits, n, datasetData);

    } else if (operation == "pow") {
      returned = Pow(element, data, nDigits, n, datasetData);

    } else if (operation == "gaussian_average") {
      returned = Gaussian_Average(element, data, nDigits, n);

    } else if (operation == "cut") {
      returned = Cut(element, data);

    } else if (operation == "n-fit") {
      returned = Fit();

    } else if (operation == "xflip") {
      returned = xFlip(element, data);

    } else if (operation == "function_gen") {
      returned = Fgen(nDigits);

    } else if (operation == "noise_gen") {
      returned = Ngen(element, data, nDigits, n);

    } else {
      console.log(operation);
    }

    if (returned != []) {
      document.getElementsByName("mod_out")[id - slot_offset[id]].innerHTML = makeTableHTML(returned[0]);
      document.getElementsByName("mod_parent")[id - slot_offset[id]].innerText = returned[2];
      document.getElementsByName("mod_param")[id - slot_offset[id]].innerText = returned[3];
      tempSet[operation] = returned[1];
    }
  }
}