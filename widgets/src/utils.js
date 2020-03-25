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

export default {
  timeout,
  toBase64,
};
