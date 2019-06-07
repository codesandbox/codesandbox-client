/**
 * Goal
 * - recursively search the src/ dir for any *.d.ts files
 * - copy those d.ts files to the lib/ dir, while keeping the same folder
 *    structure found in src/
 */
const fs = require("fs");
const path = require("path");

// get list of all files that match filter
const walk = (dir, filter) => {
  let fileList = [];
  const files = fs.readdirSync(dir);

  for (file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      const subFileList = walk(filePath, filter);
      fileList = [...fileList, ...subFileList];
    } else {
      if (filter && filter.test) {
        if (filter.test(filePath)) fileList.push(filePath);
      } else {
        fileList.push(filePath);
      }
    }
  }

  return fileList;
};

const makeNestedDir = dir => {
  if (fs.existsSync(dir)) return;

  try {
    fs.mkdirSync(dir);
  } catch (err) {
    if (err.code == "ENOENT") {
      makeNestedDir(path.dirname(dir)); //create parent dir
      makeNestedDir(dir); //create dir
    }
  }
};

copyFilesWithDirStructure = (files, outputDir) => {
  for (file of files) {
    // strip off the src dir
    const finalPath = path.join(outputDir, file.replace(/src./, ""));

    // if it's in a nested dir, we need to create the full path to the file
    // before creating the file
    makeNestedDir(path.dirname(finalPath));

    fs.copyFileSync(file, finalPath);
    console.log(`copied: ${file} -> ${finalPath}`);
  }
};

const files = walk("./src", /.*\.d\.ts/);
copyFilesWithDirStructure(files, "lib");
