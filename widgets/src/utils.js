const timeout = async (ms, timer = {}) =>
  new Promise(resolve => {
    timer.ref = setTimeout(resolve, ms);
  });

const toBase64 = file =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result.split(';');
      const value = `${result[0]};name=${file.name};${result[1]}`;
      resolve(value);
    };
    reader.onerror = error => reject(error);
  });

function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    });
  }

  return mergeDeep(target, ...sources);
}

function unflat(data) {
  const result = [];
  Object.keys(data).forEach(flatKey => {
    const keys = flatKey.split('.');
    let unftn = { [keys[keys.length - 1]]: data[flatKey] };
    // eslint-disable-next-line no-plusplus
    for (let i = keys.length - 1; i--; ) {
      unftn = { [keys[i]]: unftn };
    }
    result.push(unftn);
  });

  return mergeDeep({}, ...result);
}

export default {
  timeout,
  toBase64,
  unflat,
};
