#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const fs = require('fs');
const sysPath = require('path');
const replacePort = require('..');

const options = commandLineArgs([
  { name: 'path', type: String, defaultValue: `${__dirname}/../../react-native`},
  { name: 'new-port', type: Number, defaultValue: 8088 },
  { name: 'old-port', type: Number, defaultValue: 8081 },
]);

const usage = `Usage: react-native-port-patcher [OPTIONS]

Options:
--path      Path to the react-native package installed under your project's
            node_modules folder. In most cases this can be automatically
            determined (default: automatic)
--new-port  Port to use for react native server (default: 8088)
--old-port  Port to replace. This is the port which is hard-coded into
            react-native. Keep the default value, unless you've already changed
            it (default: 8081)
`;

function isReactNative(path) {
  if (!fs.existsSync(path)) {
    console.error(`Path does not exist:\n${path}\n`);
    return false;
  }
  if (!fs.existsSync(`${path}/package.json`)) {
    console.error(`Not an npm package:\n${path}\n`);
    return false;
  }
  try {
    const pkg = JSON.parse(fs.readFileSync(`${path}/package.json`));
    if (pkg.name !== 'react-native') {
      console.error(`Not react-native:\n${path}\n`);
      return false;
    }
  } catch (e) {
    console.error(`Error in react-native package.json:\n${e}\n`);
    return false;
  }
  return true;
}

options.path = sysPath.resolve(options.path);
if (!isReactNative(options.path)) {
  console.error(usage);
  process.exit(1);
}

replacePort(options.path, options['old-port'], options['new-port']);
