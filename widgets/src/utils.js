const timeout = async (ms, timer = {}) =>
  new Promise(resolve => {
    timer.ref = setTimeout(resolve, ms);
  });

export default {
  timeout,
};
