const argv = require('minimist')(process.argv.slice(2));
const ispyConfig = require('@ispy/config');

let config = {};

if (argv.env && typeof argv.env === 'object') { // Fix for webpack dev server --env
  Object.assign(argv, argv.env);
}

if (process.env.ARMADS_BRANCH) {
  if (ispyConfig.load(`./config-${process.env.ARMADS_BRANCH}.json`)) {
    config = Object.assign(config, ispyConfig, { registervhost: 1 });
  } else {
    throw new Error('Could not parse config-file');
  }
}

if (argv['config-file']) {
  if (ispyConfig.load(argv['config-file'])) {
    config = Object.assign(config, ispyConfig);
  } else {
    throw new Error('Could not parse config-file');
  }
}

if (argv['config-ispy-appid']) {
  if (ispyConfig.serviceLoad(argv['config-ispy-appid'])) {
    config = Object.assign(config, ispyConfig);
  } else {
    throw new Error('Could not load ispy-app-id');
  }
}

if (argv['config-json']) {
  let json;
  try {
    json = JSON.parse(argv['config-json']);
  } catch (e) {
    throw new Error('Could not parse config-json');
  }
  if (json) {
    config = Object.assign(config, json);
  }
}

if (argv.registervhost) {
  config = Object.assign(config, { registervhost: 1 });
}

const set = (cfg) => {
  config = cfg;
};

const setDefaults = (cfg) => {
  if (!argv['config-skip-default']) {
    config = Object.assign(cfg, config);
  }
};

const get = () => {
  const publicObj = {};
  for (const key in config) { // eslint-disable-line
    if (typeof config[key] !== 'function') {
      publicObj[key] = config[key];
    }
  }
  return publicObj;
};

const getPublic = () => {
  const publicObj = {};
  for (const key in config) { // eslint-disable-line
    if (typeof config[key] !== 'function' && key.charAt(0) !== '_') {
      publicObj[key] = config[key];
    }
  }
  return publicObj;
};

module.exports = { get, set, getPublic, setDefaults };
