function Fit(id, operation, nDigits) {
  var xAxis = document.getElementById("module_Ix_fit").selectedIndex;
  var yAxis = document.getElementById("module_I_fit").selectedIndex;

  var yData = datasets.dataSet_list[yAxis - 1];
  var xData = datasets.dataSet_list[xAxis - 1];

  var n = document.getElementById("fit_n").innerText;
  var name = "";

  var x_vals = [];
  var y_vals = [];

  if (n == "") {
    n = 1;
  } else {
    n = parseInt(n);
  }

  let type = ["string", "string"];

  if (yAxis != 0) {
    y_vals = yData.values;
    name = yData.name;
    type[0] = yData.type;
  }

  if (xAxis != 0) {
    x_vals = xData.values;
    type[1] = xData.type;
  } else {
    x_vals = [];
    for (let i = 0; i < y_vals.length; i++) {
      x_vals.push(i);
    }
    type[1] = "number";
  }

  if(type[0] == "number" && type[1] == "number"){
    var koeff = [];

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
  
    var elements = [document.getElementById("fit_c"), document.getElementById("fit_b"), document.getElementById("fit_a")];
  
    for (let i = 0; i < koeff.length; i++) {
      let tmp = koeff[i].dataSync();
      elements[i].innerText = Number(tmp).toFixed(2);
    }
  
    var fitTable = [["Index", "Input(x, y)", "y-Fit"]];
    var tmp = [];
  
    curveY.forEach(y => {
      tmp.push(Number(y.toFixed(nDigits)));
    });
  
    for (let i = 0; i < curveY.length; i++) {
      fitTable.push([i, x_vals[i].toString() + ", " + y_vals[i].toString(), tmp[i]]);
    }
  
    
    onReturn(id, operation, [fitTable, tmp, name, n]);
    
  }else{
    onReturn(id, operation, false);
  }
  
  document.getElementById("loading_icon").style.display = "none";
}