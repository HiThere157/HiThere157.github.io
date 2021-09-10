var csvData = [];
var buttonData = [];
var skip_row = false;

//show, update the export table TR; on data change
function exportTable() {
  let exportArray = [["Name", "Show", "", "Name", "Show"]];

  let tmp = [];
  let add_ = "checked";
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
      tmp.push(...["", "", ""]);
    }

    if (tmp.length == 6) {
      tmp.splice(-1, 1);
      exportArray.push(tmp);
      tmp = [];
    }
  }

  document.getElementById("dataExportTable").innerHTML = makeTableHTML(exportArray);
}

//adds current dataField value as GET param
function addGetParam() {
  let dataString = encodeURI(document.getElementById("dataExport").value);

  if (dataString != "%5B%5D") {
    if (dataString.length <= 1800) {
      window.history.replaceState(null, null, "?d=" + dataString);
    } else {
      openPopup("promptPopup", "prompt_o", "GET parameter is too long!  length: " + dataString.length + " > 1800!");
    }
  }
}

//updates the data export textfield TR; onchange checkboxes in the export table and format checkbox
function exportField(override = false, csvFile = false) {
  if (csvFile == false) {
    document.getElementById("copyButton").className = "";
    document.getElementById("exportButton").className = "";
  }

  let fieldElement = document.getElementById("dataExport");
  let dataString = [];
  let indexes = [];

  let tmp = [];
  let maxLen = 0;
  for (let i = 0; i < datasets.dataSet_names.length; i++) {
    if (document.getElementById("E" + i).checked == true) {
      tmp.push(datasets.dataSet_names[i]);
      indexes.push(i);
      let len = datasets.dataSet_list[i].len;

      if (len > maxLen) {
        maxLen = len;
      }
    }
  }

  if (indexes.length > 1 && override == false) {
    document.getElementById("formatOutput").checked = true;
  } else if (indexes.length != 0 && override == false) {
    document.getElementById("formatOutput").checked = false;
  }

  if (indexes.length > 0) {
    if (document.getElementById("formatOutput").checked == true || csvFile == true) {
      dataString.push(tmp);
      for (let i = 0; i < maxLen; i++) {
        let tmp = [];
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

  if (csvFile == true) {
    return dataString;
  }

  let output = [];

  dataString.forEach(set => {
    output.push("[" + set.toString() + "]");
  });

  fieldElement.value = "";
  if (output.length == 1) {
    fieldElement.value = output[0];
  } else {
    fieldElement.value = "[" + output.toString() + "]";
  }
}

//gets datastring from exportField() and downloads csv File
function makeCSVBtn() {
  openPopup("promptPopup", "prompt_io", "Enter Filename", makeCSV, [])
}
function makeCSV(prompt) {
  if (prompt != null && prompt != "") {
    if (prompt.substring(0, 2) != "!h") {
      let rows = exportField(false, true);
      let csvContent = "data:text/csv; charset=utf-8,";

      rows.forEach(function (rowArray) {
        let row = rowArray.join(csvDelimiter);
        csvContent += row + "\r\n";
      });

      let encodedUri = encodeURI(csvContent);
      createLink(encodedUri, "dl", prompt + ".csv", "exportButton");

    } else {
      let links = document.getElementsByName("dl");
      let link = links[links.length - 1 - prompt.substring(2, prompt.length)];

      if (link != undefined) {
        link.click();
      }
    }
  }
}

//copies the output string to the clipboard
function copyToClip() {
  let copyText = document.getElementById("dataExport");

  copyText.select();
  copyText.setSelectionRange(0, 99999);

  document.execCommand("copy");
  document.getElementById("copyButton").className = "pressedBtn";
}

//filters user input
function filterText(str) {
  let ret = decodeURI(str).trim();
  let filter = [["\r", ""], ["<", ""], [">", ""], ['"', ""]];

  filter.forEach(val => {
    ret = ret.replaceAll(val[0], val[1]);
  });

  return ret;
}

//trim()s all elements in an array
function trimArray(array) {
  let retArray = [];

  array.forEach(arr => {
    let tmp = [];
    arr.forEach(element => {
      tmp.push(element.trim());
    });

    retArray.push(tmp);
  });

  csvData = retArray;
  showData();
}

//converts csv string to array
var csvDelimiter = ",";
function csvToArray(str) {
  let rows = str.split("\n");
  let array = [];

  for (let i = 0; i < rows.length; i++) {
    array.push(rows[i].split(csvDelimiter));
  }

  trimArray(array);
}

//parse string from data import textfield TL; on 'submit' button, if no file uploaded
//open import popup 
function parseDataGET(str, prompt) {
  if (prompt == true) {
    parseData(str);
  }
}
function parseData(str) {
  let tmpRows = str.split("]");
  let data = [];

  for (let i = 0; i < tmpRows.length; i++) {
    let tmp = tmpRows[i].replaceAll("[", "").replaceAll('\"', "").split(",");
    if (i != 0) {
      tmp.shift();
    }

    if (tmp.length != 0) {
      data.push(tmp);
    }
  }

  if (data.length >= 1 && data[0] != "") {
    trimArray(data);
  }
}

//get the len of the longest row in csvData
function updateLen() {
  let maxLen = 0;
  csvData.forEach(row => {
    if (row.length > maxLen) {
      maxLen = row.length;
    }
  });

  return maxLen
}

//i.e. shape (2,5) -> (5,2)
function transpose(button_click = false) {
  let shape = [updateLen(), csvData.length];
  let tmp = [];

  for (let j = 0; j < shape[0]; j++) {
    let newRow = [];
    for (let i = 0; i < shape[1]; i++) {
      newRow.push(csvData[i][j]);
    }
    tmp.push(newRow);
  }

  csvData = tmp;
  showData(null, button_click);
}

//ddds the 'import data' buttons to the import table in the popup
function setButtonData() {
  buttonData = [];
  let add_ = "";
  if (skip_row == true) {
    add_ = "checked";
  }
  let header = ["<div class='flexClass'><button onclick='transpose(true)'>T</button><input type='checkbox' id='hR' onchange='showData(this)' " + add_ + "><label for='hR'>1. Row Header</label></div>"];

  for (let i = 0; i < csvData.length; i++) {
    let row = [];
    for (let j = 0; j < updateLen() + 1; j++) {
      if (i == 0 && j != 0) {
        header.push("<button name='sCs' id='sC" + j + "' onclick='saveData(this)'>Save Column</button><br><span class='table_span' id='lC" + j + "'></span>");
      }
      if (j == 0) {
        row.push("<button id='sR" + i + "' onclick='saveData(this)'>Save Row</button><span id='lR'" + i + "></span>");
      } else {
        row.push("");
      }
    }
    buttonData.push(row);
  }

  buttonData.unshift(header);
}

//shows import popup & displays tables
//detects, if data header available (name)
function showData(element = null, skip_transpose = false) {
  openPopup("table_popup")
  skip_row = false;

  if (element != null) {
    if (element.checked == true) {
      skip_row = true;
    }

  } else {
    if (csvData.length > 5) {
      if (isNaN(csvData[0][0]) != isNaN(csvData[1][0]) && csvData[0][0] != "NaN" && csvData[1][0] != "NaN") {
        skip_row = true;
      }

    } else {
      if (skip_transpose == false) {
        transpose(true);
      }
    }
  }

  setButtonData();

  let combinedData = [];
  for (let i = 0; i < buttonData.length; i++) {
    let row = [];
    for (let j = 0; j < buttonData[0].length; j++) {
      if (i > 0 && j > 0) {
        row.push(csvData[i - 1][j - 1]);
      } else {
        row.push(buttonData[i][j]);
      }
    }
    if (i == 0 || i > 1 || skip_row == false) {
      combinedData.push(row);
    }
  }

  document.getElementById("table_popup_table").innerHTML = makeTableHTML(combinedData);

  if (skip_row == true) {
    for (let i = 0; i < csvData[0].length; i++) {
      document.getElementById("lC" + (i + 1)).innerText = "Name: " + csvData[0][i];
      document.getElementById("lC" + (i + 1)).style = "display:block";
    }
  }

  overviewTable(document.getElementById("table_popup_side"));
}

//on 'submit' button
document.getElementById("importForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let input = document.getElementById("csvFile").files[0];
  let reader = new FileReader();

  reader.onload = function (e) {
    let text = e.target.result;
    csvToArray(filterText(text));
  };

  try {
    reader.readAsText(input);
  } catch {
    parseData(filterText(document.getElementById("dataInput").value));
  }
});

//get datatype of an array
function getType(array) {
  let ret = "number";
  let retArray = [];
  array.forEach(value => {
    if (isNaN(Number(value)) == true && value != undefined && value != "NaN") {
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

//save all columns as datasets
function importAll() {
  document.getElementsByName("sCs").forEach(element => {
    saveData(element);
  });
}

//saves the data to a dataset
function saveData(element) {
  let id = element.id.substring(2, element.id.length);
  let type = element.id[1];
  let start_index = 0;
  let name = "";

  if (skip_row == true) {
    start_index = 1;
    if (type == "C") {
      name = csvData[0][id - 1];
    }
  }

  let data = [];
  if (type == "R") {
    csvData[id].forEach(element => {
      if (element != "" && element != undefined) {
        data.push(element);
      }
    });

  } else if (type == "C") {
    for (let i = start_index; i < csvData.length; i++) {
      let tmp = csvData[i][id - 1]
      if (tmp != "" && tmp != undefined) {
        data.push(tmp);
      }
    }
  }

  let tmpRet = getType(data);

  if (tmpRet[1].length != 0) {
    element.className = "pressedBtn";
    datasets.add(new DataSet(tmpRet[1], true, "Import", name, "", "", tmpRet[0]));
    updateDropdown(true, false, true);
  }
}