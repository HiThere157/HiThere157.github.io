function copyObj(obj) {
  if (Array.isArray(obj)) {
    let newArray = [];
    obj.forEach(element => {
      newArray.push(copyObj(element));
    });
    return newArray;
  } else if (typeof obj == "object") {
    let keys = Object.getOwnPropertyNames(obj);
    let newObj = {};
    keys.forEach(key => {
      let tmp = copyObj(obj[key])
      newObj[key] = tmp;
    });

    let proto = Object.getPrototypeOf(obj);
    let protoKeys = Object.getOwnPropertyNames(proto);
    let newProto = {};

    protoKeys.forEach(protoKey => {
      if (protoKey != "constructor") {
        newProto[protoKey] = proto[protoKey];
      }
    });

    Object.setPrototypeOf(newObj, newProto);
    return newObj;
  } else {
    return obj;
  }
}