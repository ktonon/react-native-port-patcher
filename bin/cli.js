#!/usr/bin/env node

const commandLineArgs = require('command-line-args');
const fs = require('fs');
const sysPath = require('path');
const replacePort = require('..');

const options = commandLineArgs([
  { name: 'path', type: String, multiple: true, defaultValue: [
    `${__dirname}/../../react-native`,
    `${__dirname}/../../@react-native-community`
  ]},
  { name: 'new-port', type: Number, defaultValue: 8088 },
  { name: 'old-port', type: Number, defaultValue: 8081 },
]);

const usage = `Usage: react-native-port-patcher [OPTIONS]

Options:
--path      Paths to the react-native package and @react-native-community packages installed
            under your project's node_modules folder. In most cases this can be automatically
            determined, if specifying manually, provide multiple paths (default: automatic)
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
  if (sysPath.basename(path) === '@react-native-community') {
    // Allow passing the whole @react-native-community folder in node_modules.
    return true;
  }
  if (!fs.existsSync(`${path}/package.json`)) {
    console.error(`Not an npm package:\n${path}\n`);
    return false;
  }
  try {
    const pkg = JSON.parse(fs.readFileSync(`${path}/package.json`));
    if (pkg.name !== 'react-native' &&
        pkg.name !== 'react-native-windows' &&
        !pkg.name.startsWith('@react-native-community/')
    ) {
      console.error(`Not react-native or @react-native-community:\n${path}\n`);
      return false;
    }
  } catch (e) {
    console.error(`Error in ${path} package.json:\n${e}\n`);
    return false;
  }
  return true;
}

function processPath(path) {
  const resolvedPath = sysPath.resolve(path);
  if (!isReactNative(resolvedPath)) {
    console.error(usage);
    process.exit(1);
  }

  replacePort(resolvedPath, options['old-port'], options['new-port']);
}

options.path.forEach(processPath);
