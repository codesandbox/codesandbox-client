#! /usr/bin/env node
// Generates test fixtures for Zip FS.
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';

const baseFolder = `.`;
const srcFolder = `${baseFolder}/test/fixtures/files`;
const outputFolder = `${baseFolder}/test/fixtures/zipfs`;

// Create a zip file of the fixture data using the given zlib compression level.
function createZip(level: number): void {
  const output = fs.createWriteStream(`${outputFolder}/zipfs_fixtures_l${level}.zip`);
  const options = { zlib: { level: level } };
  const archive = archiver('zip', options);
  archive.on('error', (err: any) => {
    throw err;
  });
  archive.pipe(output);
  addFolder(archive, srcFolder);
  archive.finalize();
}

// Recursively add folders and their files to the zip file.
function addFolder(archive: any, folder: string) {
  fs.readdirSync(folder).forEach((file) => {
    const fullpath = path.join(folder, file);
    if (fs.statSync(fullpath).isDirectory()) {
      addFolder(archive, fullpath);
    } else {
      addFile(archive, fullpath);
    }
  });
}

// Add the given file to the zip file.
function addFile(archive: any, fileName: string) {
  const fileNameRelative = path.relative(baseFolder, fileName);
  archive.append(fs.createReadStream(fileName), {name: fileNameRelative});
}

// Ensure output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

// Store
createZip(0);
// Middle-of-the-road compression
createZip(4);
// Maximum compression
createZip(9);
