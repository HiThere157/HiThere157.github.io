//determine if color is dark or light
function lightOrDark(color) {
  if (color.match(/^rgb/)) {
    color = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/);

    r = color[1];
    g = color[2];
    b = color[3];
  }
  else {
    //convert it to HEX
    color = + ("0x" + color.slice(1).replace(color.length < 5 && /./g, '$&$&'));

    r = color >> 16;
    g = color >> 8 & 255;
    b = color & 255;
  }

  // HSP (Highly Sensitive Poo)
  hsp = Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));

  return hsp > 127.5 ? 1 : 0;
}

//on new overlay color
function colorChange(element) {
  //sync input value bewteen module template and actual module
  document.getElementsByName("color_input").forEach(element => {
    element.value = document.getElementById("color_input").value;
  });

  document.documentElement.style.setProperty("--header", element.value);
  document.documentElement.style.setProperty("--selection", element.value + "bb");

  if (lightOrDark(element.value) == 1) {
    document.documentElement.style.setProperty("--header-color", "#000");
  } else {
    document.documentElement.style.setProperty("--header-color", "#fff");
  }
}

//changes Theme to Dark/Light mode
function changeTheme(element) {
  //sync checkbox state bewteen module template and actual module
  document.getElementsByName("theme_input").forEach(element => {
    element.checked = document.getElementById("theme_input").checked;
  });

  if (element.checked == true) {
    document.getElementsByTagName("html")[0].className = "darkTheme";

    let invertElement = document.getElementById("invert_input");
    if (invertElement.checked == true) {
      invertElement.click();
    }

  } else {
    document.getElementsByTagName("html")[0].className = "";
  }
}

//apply invert filter
function invertTheme(element) {
  //sync checkbox state bewteen module template and actual module
  document.getElementsByName("invert_input").forEach(element => {
    element.checked = document.getElementById("invert_input").checked;
  });

  if (element.checked == true) {
    document.documentElement.style.setProperty("--invert", "1");

    let themeElement = document.getElementById("theme_input");
    if (themeElement.checked == true) {
      themeElement.click();
    }

  } else {
    document.documentElement.style.setProperty("--invert", "0");
  }
}

//change default round to n
var default_nDigigts = 3;
function changeRound(element) {
  //sync value bewteen module template and actual module
  document.getElementsByName("round_input").forEach(element => {
    element.value = document.getElementById("round_input").value;
  });

  default_nDigigts = parseInt(element.value);
  if (default_nDigigts < 0) {
    default_nDigigts = 0;
    element.value = 0;
  }
  updateAll();
}

//change csv delimiter
function changeDelimiter(element) {
  //sync value bewteen module template and actual module
  document.getElementsByName("csvDelimiter_input").forEach(element => {
    element.value = document.getElementById("csvDelimiter_input").value;
  });

  csvDelimiter = filterText(element.value);
}

//change chart line colors
var lineColors = [document.getElementById("line_color_input0").value, document.getElementById("line_color_input1").value];
function lineColorChange() {
  let l0 = document.getElementById("line_color_input0").value;
  let l1 = document.getElementById("line_color_input1").value;
  //sync checkbox state bewteen module template and actual module
  document.getElementsByName("line_color_input0").forEach(element => {
    element.value = l0;
  });
  document.getElementsByName("line_color_input1").forEach(element => {
    element.value = l1;
  });

  lineColors = [l0, l1];
  updateAll(true);
}

//change default resolution for PNGs
var resolution = ["720", "480"];
function reolutionChange(reverse = false) {
  //sync checkbox state bewteen module template and actual module
  let tmp = [...document.getElementsByName("resolution_input")];
  let element = tmp[0];
  if (reverse == true) {
    tmp.reverse();
    element = tmp[1];
  }
  tmp[1].selectedIndex = tmp[0].selectedIndex;

  let custom_input = document.getElementById("custom_resolution");

  if (element.selectedIndex == 5) {
    custom_input.style = "";

    if (reverse == true) {
      document.getElementById("custom_width").value = resolution[0];
      document.getElementById("custom_height").value = resolution[1];
    }

    let width = document.getElementById("custom_width").value;
    let height = document.getElementById("custom_height").value;

    if (width != "" && height != "") {
      resolution = [width, height];
    }

  } else {
    custom_input.style.display = "none";
    resolution = element.value.split(" x ");
  }
}