const fs = require('fs');
const path = require('path');

function walkSync(dir, pattern, cb) {
  fs.readdirSync(dir).forEach(function(file) {
    const path = `${dir}/${file}`;
    if (fs.statSync(path).isDirectory()) {
      filelist = walkSync(path, pattern, cb);
    } else if (pattern.test(file)) {
      cb(path);
    }
  });
}

module.exports = function(packagePath, oldPort, newPort) {
  const portPattern = new RegExp(`\\b${oldPort}\\b`, 'g');

  console.log(`Replacing ${path.basename(packagePath)} hard coded port ${oldPort} with ${newPort}...`);
  walkSync(packagePath,
    /\.(m|h|js|java|pbxproj|cs|ts)$/,
    (file) => {
      const content = fs.readFileSync(file, 'utf8');
      if (portPattern.test(content)) {
        fs.writeFileSync(file, content.replace(portPattern, newPort));
        console.log(`  - ${file.slice(path.length)}`);
      }
    });
};
