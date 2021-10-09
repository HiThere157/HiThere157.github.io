function copyObj(obj) {
  if (Array.isArray(obj)) {
    let newArray = [];
    obj.forEach(element => {
      newArray.push(copyObj(element));
    });
    return newArray;
  } else if (typeof obj == "object") {
    let newObj = {};
    Object.getOwnPropertyNames(obj).forEach(key => {
      newObj[key] = copyObj(obj[key]);
    });

    let proto = Object.getPrototypeOf(obj);
    let newProto = {};
    Object.getOwnPropertyNames(proto).forEach(protoKey => {
      if (protoKey != "constructor") {
        newProto[protoKey] = proto[protoKey];
      }
    });

    Object.setPrototypeOf(newObj, newProto);
    return newObj;
  }
  return obj;
}