function removeNaN(x, y) {
  let tmp = []
  let tmpX = []
  let tmpY = []
  for (let i = 0; i < x.length; i++) {
    if (isNaN(x[i]) == false && isNaN(y[i]) == false && Math.abs(x[i]) != Infinity && Math.abs(y[i]) != Infinity) {
      tmpX.push(x[i]);
      tmpY.push(y[i]);
    } else {
      tmp.push(i);
    }
  }

  return [tmpX, tmpY, tmp];
}

function Fit(id, operation, nDigits) {
  let type = document.getElementById("fit_type").value;
  let type_span = document.getElementById("fit_function");

  let xAxis = document.getElementById("module_Ix_fit").selectedIndex;
  let yAxis = document.getElementById("module_I_fit").selectedIndex;

  let yData = datasets.dataSet_list[yAxis - 1];
  let xData = datasets.dataSet_list[xAxis - 1];

  let n = document.getElementById("fit_n").innerText;
  let name = "";

  let x_vals = [];
  let y_vals = [];

  if (n == "") {
    n = 1;
  } else {
    n = parseInt(n);
  }

  let dataType = ["string", "string"];

  if (yAxis != 0) {
    y_vals = yData.values;
    name = yData.name;
    dataType[0] = yData.type;
  }

  if (xAxis != 0) {
    x_vals = xData.values;
    dataType[1] = xData.type;
  } else {
    x_vals = [];
    for (let i = 0; i < y_vals.length; i++) {
      x_vals.push(i);
    }
    dataType[1] = "number";
  }

  if (type == "Poly") {
    type_span.innerText = "y = ax^2 + bx + c";

  } else if (type == "Exp") {
    type_span.innerText = "y = e^(ax^2 + bx + c)";

    if (yAxis != 0) {
      let tmp = [];

      y_vals.forEach(value => {
        tmp.push(Math.log(value));
      });
      y_vals = tmp;
    }

  } else if (type == "Log") {
    type_span.innerText = "y = ln(ax^2 + bx + c)";

    if (yAxis != 0) {
      let tmp = [];

      y_vals.forEach(value => {
        tmp.push(Math.exp(value));
      });
      y_vals = tmp;
    }
  }

  let removedIndex;
  [x_vals, y_vals, removedIndex] = removeNaN(x_vals, y_vals);
  console.log(x_vals, y_vals)

  if (dataType[0] == "number" && dataType[1] == "number") {
    let koeff = [];

    const learningRate = 0.4;
    const optimizer = tf.train.adam(learningRate);

    for (let i = 0; i < n + 1; i++) {
      koeff.push(tf.variable(tf.scalar(Math.random(-1, 1))));
    }

    function loss(pred, labels) {
      return pred.sub(labels).square().mean();
    }

    function predict(x) {
      const xs = tf.tensor1d(x);

      if (n == 1) {
        var ys = xs.mul(koeff[1]).add(koeff[0]);
      } else if (n == 2) {
        var ys = xs.square().mul(koeff[2]).add(xs.mul(koeff[1])).add(koeff[0]);
      }

      return ys;
    }

    for (let i = 0; i < 2000; i++) {
      tf.tidy(() => {
        if (x_vals.length > 0) {
          const ys = tf.tensor1d(y_vals);
          optimizer.minimize(() => loss(predict(x_vals), ys));
        }
      });

      const ys = tf.tidy(() => predict(x_vals));
      var curveY = ys.dataSync();
      ys.dispose();
    }

    let elements = [document.getElementById("fit_c"), document.getElementById("fit_b"), document.getElementById("fit_a")];

    for (let i = 0; i < koeff.length; i++) {
      let tmp = koeff[i].dataSync();
      elements[i].innerText = Number(tmp).toFixed(2);
    }

    let fitTable = [["Index", "Input(x, y)", "y-Fit"]];
    let tmp = [];

    for (let i = 0; i < curveY.length; i++) {
      let tmpY = curveY[i];
      if (type == "Exp") {
        tmpY = Math.exp(curveY[i]);
      } else if (type == "Log") {
        tmpY = Math.log(curveY[i]);
      }

      tmp.push(Number(tmpY.toFixed(nDigits)));
    }

    removedIndex.forEach(index => {
      tmp.splice(index, 0, NaN);
    });

    for (let i = 0; i < curveY.length; i++) {
      fitTable.push([i, x_vals[i].toString() + ", " + y_vals[i].toString(), tmp[i]]);
    }

    onReturn(id, operation, [fitTable, tmp, name, n]);

  } else if (yAxis != 0) {
    onReturn(id, operation, false);
  }

  document.getElementById("loading_icon").style.display = "none";
  console.log(removedIndex)
}