/* eslint-disable */

let chalk = require('chalk');
let fs = require('fs');
let path = require('path');
let filesize = require('filesize');
let gzipSize = require('gzip-size').sync;
let rimrafSync = require('rimraf').sync;
let webpack = require('webpack');
let config = require('../config/webpack.prod');
let paths = require('../config/paths');
let recursive = require('recursive-readdir');
let stripAnsi = require('strip-ansi');

// Input: /User/dan/app/build/static/js/main.82be8.js
// Output: /static/js/main.js
function removeFileNameHash(fileName) {
  return fileName
    .replace(paths.appBuild, '')
    .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3);
}

// Input: 1024, 2048
// Output: "(+1 KB)"
function getDifferenceLabel(currentSize, previousSize) {
  let FIFTY_KILOBYTES = 1024 * 50;
  let difference = currentSize - previousSize;
  let fileSize = !Number.isNaN(difference) ? filesize(difference) : 0;
  if (difference >= FIFTY_KILOBYTES) {
    return chalk.red(`+${fileSize}`);
  } else if (difference < FIFTY_KILOBYTES && difference > 0) {
    return chalk.yellow(`+${fileSize}`);
  } else if (difference < 0) {
    return chalk.green(fileSize);
  } else {
    return '';
  }
}

// First, read the current file sizes in build directory.
// This lets us display how much they changed later.
recursive(paths.appBuild, (err, fileNames) => {
  let previousSizeMap = (fileNames || [])
    .filter(fileName => /\.(js|css)$/.test(fileName))
    .reduce((memo, fileName) => {
      let contents = fs.readFileSync(fileName);
      let key = removeFileNameHash(fileName);
      memo[key] = gzipSize(contents);
      return memo;
    }, {});

  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  rimrafSync(`${paths.appBuild}/*`);

  // Start the webpack build
  build(previousSizeMap);
});

// Print a detailed summary of build files.
function printFileSizes(stats, previousSizeMap) {
  let assets = stats
    .toJson()
    .assets.filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      let fileContents = fs.readFileSync(`${paths.appBuild}/${asset.name}`);
      let size = gzipSize(fileContents);
      let previousSize = previousSizeMap[removeFileNameHash(asset.name)];
      let difference = getDifferenceLabel(size, previousSize);
      return {
        folder: path.join('build', path.dirname(asset.name)),
        name: path.basename(asset.name),
        size,
        sizeLabel: filesize(size) + (difference ? ` (${difference})` : ''),
      };
    });
  assets.sort((a, b) => b.size - a.size);
  let longestSizeLabelLength = Math.max.apply(
    null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  );
  assets.forEach(asset => {
    let sizeLabel = asset.sizeLabel;
    let sizeLength = stripAnsi(sizeLabel).length;
    if (sizeLength < longestSizeLabelLength) {
      let rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }
    console.log(
      `  ${sizeLabel}  ${chalk.dim(asset.folder + path.sep)}${chalk.cyan(
        asset.name
      )}`
    );
  });
}

// Create the production build and print the deployment instructions.
function build(previousSizeMap) {
  console.log(
    `Creating a ${
      process.env.NODE_ENV === 'production' ? 'production' : 'development'
    } build...`
  );
  webpack(config).run((err, stats) => {
    if (err) {
      console.error('Failed to create a production build. Reason:');
      console.error(err.message || err);
      process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();

    console.log('File sizes after gzip:');
    console.log();
    printFileSizes(stats, previousSizeMap);
    fs.writeFile(
      paths.appBuild + '/stats.json',
      JSON.stringify(stats.toJson())
    );
    console.log();

    let openCommand = process.platform === 'win32' ? 'start' : 'open';
    let homepagePath = require(paths.appPackageJson).homepage;
    let publicPath = config.output.publicPath;
    if (homepagePath && homepagePath.indexOf('.github.io/') !== -1) {
      // "homepage": "http://user.github.io/project"
      console.log(
        `The project was built assuming it is hosted at ${chalk.green(
          publicPath
        )}.`
      );
      console.log(
        `You can control this with the ${chalk.green(
          'homepage'
        )} field in your ${chalk.cyan('package.json')}.`
      );
      console.log();
      console.log(`The ${chalk.cyan('build')} folder is ready to be deployed.`);
      console.log(`To publish it at ${chalk.green(homepagePath)}, run:`);
      console.log();
      console.log(
        `  ${chalk.cyan('git')} commit -am ${chalk.yellow(
          '"Save local changes"'
        )}`
      );
      console.log(`  ${chalk.cyan('git')} checkout -B gh-pages`);
      console.log(`  ${chalk.cyan('git')} add -f build`);
      console.log(
        `  ${chalk.cyan('git')} commit -am ${chalk.yellow('"Rebuild website"')}`
      );
      console.log(
        `  ${chalk.cyan(
          'git'
        )} filter-branch -f --prune-empty --subdirectory-filter build`
      );
      console.log(`  ${chalk.cyan('git')} push -f origin gh-pages`);
      console.log(`  ${chalk.cyan('git')} checkout -`);
      console.log();
    } else if (publicPath !== '/') {
      // "homepage": "http://mywebsite.com/project"
      console.log(
        `The project was built assuming it is hosted at ${chalk.green(
          publicPath
        )}.`
      );
      console.log(
        `You can control this with the ${chalk.green(
          'homepage'
        )} field in your ${chalk.cyan('package.json')}.`
      );
      console.log();
      console.log(`The ${chalk.cyan('build')} folder is ready to be deployed.`);
      console.log();
    } else {
      // no homepage or "homepage": "http://mywebsite.com"
      console.log(
        'The project was built assuming it is hosted at the server root.'
      );
      if (homepagePath) {
        // "homepage": "http://mywebsite.com"
        console.log(
          `You can control this with the ${chalk.green(
            'homepage'
          )} field in your ${chalk.cyan('package.json')}.`
        );
        console.log();
      } else {
        // no homepage
        console.log(
          `To override this, specify the ${chalk.green(
            'homepage'
          )} in your ${chalk.cyan('package.json')}.`
        );
        console.log('For example, add this to build it for GitHub Pages:');
        console.log();
        console.log(
          `  ${chalk.green('"homepage"')}${chalk.cyan(': ')}${chalk.green(
            '"http://myname.github.io/myapp"'
          )}${chalk.cyan(',')}`
        );
        console.log();
      }
      console.log(`The ${chalk.cyan('build')} folder is ready to be deployed.`);
      console.log('You may also serve it locally with a static server:');
      console.log();
      console.log(`  ${chalk.cyan('npm')} install -g pushstate-server`);
      console.log(`  ${chalk.cyan('pushstate-server')} build`);
      console.log(`  ${chalk.cyan(openCommand)} http://localhost:9000`);
      console.log();
    }
  });
}
