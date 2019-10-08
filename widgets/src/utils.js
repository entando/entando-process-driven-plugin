const timeout = async ms => new Promise(resolve => setTimeout(resolve, ms));

export default {
  timeout,
};
