var importForm = document.getElementById("importForm");
var csvFile = document.getElementById("csvFile");
var csvData = [];
var buttonData = [];
var skip_row = false;

function exportTable() {
  var exportArray = [["Name", "Export", "", "Name", "Export"]];

  var tmp = [];
  var add_ = "checked";
  for (let i = 0; i < datasets.dataSet_names.length; i++) {
    if(["R", "R+"].includes(datasets.dataSet_names[i]) == true){
      add_ = "";
    }else{
      add_ = "checked";
    }

    tmp.push(datasets.dataSet_names[i]);
    tmp.push("<input type='checkbox' id='E" + i + "' onchange='exportField()' " + add_ + ">");
    tmp.push("");

    if (i == datasets.dataSet_names.length - 1 && tmp.length == 3) {
      tmp.push("")
      tmp.push("")
      tmp.push("")
    }

    if (tmp.length == 6) {
      tmp.splice(-1, 1);
      exportArray.push(tmp);
      tmp = [];
    }
  }

  document.getElementById("dataExportTable").innerHTML = makeTableHTML(exportArray);
}

function exportField() {
  var fieldElement = document.getElementById("dataExport");
  fieldElement.value = "";
  var dataString = [];
  var indexes = [];

  var tmp = [];
  var maxLen = 0;
  for (let i = 0; i < datasets.dataSet_names.length; i++) {
    if (document.getElementById("E" + i).checked == true) {
      tmp.push(datasets.dataSet_names[i]);
      indexes.push(i);
      var len = datasets.dataSet_list[i].len;

      if(len > maxLen){
        maxLen = len;
      }
    }
  }

  if(indexes.length > 1){
    dataString.push(tmp)
    for(let i = 0; i < maxLen; i++){
      var tmp = [];
      indexes.forEach(index => {
        if(datasets.dataSet_list[index].values[i] == undefined){
          tmp.push("");
        }else{
          tmp.push(datasets.dataSet_list[index].values[i])
        }
      });
  
      dataString.push(tmp)
    }
  }else{
    dataString = [datasets.dataSet_list[indexes[0]].values]
  }

  var output = []

  dataString.forEach(set => {
    output.push("[" + set.toString() + "]")
  });

  if(output.length == 1){
    fieldElement.value = output[0];
  }else{
    fieldElement.value = "[" + output.toString() + "]";
  }
}

function csvToArray(str, delimiter = ",") {
  let rows = str.split("\n");
  let array = [];

  for (let i = 0; i < rows.length; i++) {
    array.push(rows[i].split(delimiter));
  }

  return array;
}

function parseData(element) {
  var str = element.value;
  var tmpRows = str.split("]");
  var data = [];

  for (let i = 0; i < tmpRows.length; i++) {
    let tmp = tmpRows[i].replaceAll("[", "").replaceAll('\"', "").split(",");
    if (i != 0) {
      tmp.shift()
    }

    if (tmp.length != 0) {
      data.push(tmp)
    }

  }
  csvData = data;

  showData();
}

function setButtonData() {
  buttonData = [];
  var add_ = "";
  if (skip_row == true) {
    add_ = "checked";
  }
  var header = ["<input type='checkbox' id='hR' onchange='showData(this)' " + add_ + "><label for='hR'>1. Row Header</label>"];

  for (let i = 0; i < csvData.length; i++) {
    var row = [];
    for (let j = 0; j < csvData[0].length + 1; j++) {
      if (i == 0 && j != 0) {
        header.push("<button id='sC" + j + "' onclick='saveData(this)'>Save Column</button><br><label class='table_label' id='lC" + j + "'></label>");
      }
      if (j == 0) {
        row.push("<button id='sR" + i + "' onclick='saveData(this)'>Save Row</button><label id='lR'" + i + "></label>");
      } else {
        row.push("");
      }
    }
    buttonData.push(row);
  }

  buttonData.unshift(header);
}

function showData(element = null) {
  document.getElementById("table_popup").style = "display: block;";
  skip_row = false;

  if (element != null) {
    if (element.checked == true) {
      skip_row = true;
    }
  } else {
    if (csvData.length > 1) {
      if (isNaN(csvData[0][0]) != isNaN(csvData[1][0])) {
        skip_row = true;
      }
    } else {
      if (isNaN(csvData[0][0]) != isNaN(csvData[0][1])) {
        skip_row = true;
      }
    }
  }

  setButtonData()

  var combinedData = []
  for (let i = 0; i < buttonData.length; i++) {
    var row = [];
    for (let j = 0; j < buttonData[0].length; j++) {
      if (i > 0 && j > 0) {
        row.push(csvData[i - 1][j - 1]);
      } else {
        row.push(buttonData[i][j]);
      }
    }
    if (i == 0 || i > 1 || skip_row == false)
      combinedData.push(row);
  }

  document.getElementById("table_popup_table").innerHTML = makeTableHTML(combinedData);

  if (skip_row == true) {
    for (let i = 0; i < csvData[0].length; i++) {
      document.getElementById("lC" + (i + 1)).innerText = "Name: " + csvData[0][i];
      document.getElementById("lC" + (i + 1)).style = "display: block";
    }
  }

  overviewTable(document.getElementById("table_popup_side"));
}

importForm.addEventListener("submit", function (e) {
  e.preventDefault();
  var input = csvFile.files[0];
  var reader = new FileReader();

  reader.onload = function (e) {
    var text = e.target.result;
    csvData = csvToArray(text);
    showData();
  };

  try {
    reader.readAsText(input);
  } catch {
    parseData(document.getElementById("dataInput"));
  }
});

function close_popup(element) {
  let parent = element.parentElement.parentElement;
  parent.style = "display: none;";
}

function getType(array) {
  var ret = "number";
  let retArray = [];
  array.forEach(value => {
    if (isNaN(Number(value)) == true) {
      ret = "string";
      value.replaceAll('\"', '');
    }
  });

  if (ret == "number") {
    array.forEach(value => {
      retArray.push(Number(value));
    });

    array = retArray;
  }

  return [ret, array];
}

function saveData(element) {
  let id = element.id.substring(2, element.id.length);
  let type = element.id[1];
  var start_index = 0;
  var name = "";

  if (skip_row == true) {
    start_index = 1;
    if (type == "C") {
      name = csvData[0][id - 1];
    }
  }

  var data = [];
  if (type == "R") {
    data = csvData[id];
  } else if (type == "C") {
    for (let i = start_index; i < csvData.length; i++) {
      data.push(csvData[i][id - 1]);
    }
  }

  let tmpRet = getType(data);

  element.style = "background-color: #cccccc;";
  datasets.add(new DataSet(tmpRet[1], true, "Data", name.replaceAll('"', '').trim(), "", "", tmpRet[0]));
  updateDropdown();
}