react-native-port-patcher
=========================

Attempts to resolve this issue: https://productpains.com/post/react-native/allow-packager-port-to-be-configurable-change-from-8081/

## HowTo

Install it as a dev-dependency in your react-native project:

```shell
npm install -D react-native-port-patcher
```

Then update your `package.json` to include:

```js
  "scripts": {
    "postinstall": "react-native-port-patcher --new-port 8088"
  }
```

Now after you `yard install` or `npm install`, the script will find your `react-native` package under `node_modules` and regex search/replace all instances of `/\b8081\b/g` with the port you provide.
