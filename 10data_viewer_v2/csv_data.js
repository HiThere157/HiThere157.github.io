var importForm = document.getElementById("importForm");
var csvFile = document.getElementById("csvFile");
var csvData = [];
var buttonData = [];
var skip_row = false;

//Show, Update the export table TR; on data change
function exportTable() {
  var exportArray = [["Name", "Export", "", "Name", "Export"]];

  var tmp = [];
  var add_ = "checked";
  for (let i = 0; i < datasets.dataSet_names.length; i++) {
    if (["R", "R+"].includes(datasets.dataSet_names[i]) == true) {
      add_ = "";
    } else {
      add_ = "checked";
    }

    tmp.push(datasets.dataSet_names[i]);
    tmp.push("<input type='checkbox' id='E" + i + "' onchange='exportField()' " + add_ + ">");
    tmp.push("");

    if (i == datasets.dataSet_names.length - 1 && tmp.length == 3) {
      tmp.push("");
      tmp.push("");
      tmp.push("");
    }

    if (tmp.length == 6) {
      tmp.splice(-1, 1);
      exportArray.push(tmp);
      tmp = [];
    }
  }

  document.getElementById("dataExportTable").innerHTML = makeTableHTML(exportArray);
}

//Updates the data export textfield TR; onchange checkboxes in the export Table
function exportField(override = false) {
  var fieldElement = document.getElementById("dataExport");
  fieldElement.value = "";
  var dataString = [];
  var indexes = [];

  var tmp = [];
  for (let i = 0; i < datasets.dataSet_names.length; i++) {
    if (document.getElementById("E" + i).checked == true) {
      tmp.push(datasets.dataSet_names[i]);
      indexes.push(i);
    }
  }

  if (indexes.length > 1 && override == false) {
    document.getElementById("formatOutput").checked = true;
  } else if (indexes.length != 0 && override == false) {
    document.getElementById("formatOutput").checked = false;
  }

  if (indexes.length > 0) {
    if (document.getElementById("formatOutput").checked == true) {
      dataString.push(tmp);
      for (let i = 0; i < updateLen(); i++) {
        var tmp = [];
        indexes.forEach(index => {
          if (datasets.dataSet_list[index].values[i] == undefined) {
            tmp.push("");
          } else {
            tmp.push(datasets.dataSet_list[index].values[i]);
          }
        });

        dataString.push(tmp);
      }
    } else {
      indexes.forEach(index => {
        dataString.push([datasets.dataSet_list[index].values]);
      });
    }
  }

  var output = [];

  dataString.forEach(set => {
    output.push("[" + set.toString() + "]");
  });

  if (output.length == 1) {
    fieldElement.value = output[0];
  } else {
    fieldElement.value = "[" + output.toString() + "]";
  }
}

//Converts csv String to array
function csvToArray(str, delimiter = ",") {
  let rows = str.split("\n");
  let array = [];

  for (let i = 0; i < rows.length; i++) {
    array.push(rows[i].split(delimiter));
  }

  return array;
}

//Parse String from data import textfield TL; on 'Submit' button, if no file uploaded
//Open import popup 
function parseData(element) {
  var str = element.value;
  var tmpRows = str.split("]");
  var data = [];

  for (let i = 0; i < tmpRows.length; i++) {
    let tmp = tmpRows[i].replaceAll("[", "").replaceAll('\"', "").split(",");
    if (i != 0) {
      tmp.shift();
    }

    if (tmp.length != 0) {
      data.push(tmp);
    }

  }
  csvData = data;

  showData();
}

//get the len of the longest row in csvData
function updateLen() {
  var maxLen = 0;
  csvData.forEach(row => {
    if (row.length > maxLen) {
      maxLen = row.length;
    }
  });

  return maxLen
}

//i.e. shape (2,5) -> (5,2)
function transpose() {

  let shape = [updateLen(), csvData.length];
  var temp = [];

  for (let j = 0; j < shape[0]; j++) {
    var newRow = [];
    for (let i = 0; i < shape[1]; i++) {
      newRow.push(csvData[i][j]);
    }
    temp.push(newRow);
  }

  csvData = temp;

  showData();
}

//Adds the 'Import Data' Buttons to the import table in the popup
function setButtonData() {
  buttonData = [];
  var add_ = "";
  if (skip_row == true) {
    add_ = "checked";
  }
  var header = ["<button onclick='transpose()'>T</button><input type='checkbox' id='hR' onchange='showData(this)' " + add_ + "><label for='hR'>1. Row Header</label>"];

  for (let i = 0; i < csvData.length; i++) {
    var row = [];
    for (let j = 0; j < updateLen() + 1; j++) {
      if (i == 0 && j != 0) {
        header.push("<button name='sCs' id='sC" + j + "' onclick='saveData(this)'>Save Column</button><br><label class='table_label' id='lC" + j + "'></label>");
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

//Shows import popup & displays tables
//Detects, if data header available (name)
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

  setButtonData();

  var combinedData = [];
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

//on 'Submit' button
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

//closes popup
function close_popup(element) {
  let parent = element.parentElement.parentElement;
  parent.style = "display: none;";
}

//get type of an array
function getType(array) {
  var ret = "number";
  let retArray = [];
  array.forEach(value => {
    if (isNaN(Number(value)) == true && value != undefined) {
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

//save all Columns as datasets
function importAll() {
  document.getElementsByName("sCs").forEach(element => {
    saveData(element);
  });
}

//saves the data to a dataset
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
      var tmp = csvData[i][id - 1]
      if (tmp != "" && tmp != undefined) {
        data.push(tmp);
      }
    }
  }

  let tmpRet = getType(data);

  if (tmpRet[1].length != 0) {
    element.style = "background-color: #cccccc;";
    datasets.add(new DataSet(tmpRet[1], true, "Data", name.replaceAll('"', '').trim(), "", "", tmpRet[0]));
    updateDropdown(true, false, false);
  }
}