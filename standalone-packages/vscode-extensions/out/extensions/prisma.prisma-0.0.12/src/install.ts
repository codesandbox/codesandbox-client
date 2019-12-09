// Mini download script to fetch prisma-fmt binary during install. 
import * as os from 'os';
import * as https from 'https';
import * as fs from 'fs';

// Decides which platform to use.
function getPlatform() {
  const platform = os.platform();
  if(platform === "darwin") {
    return platform;
  } else if(platform === 'linux') {
    return 'linux-glibc';
  } else {
    throw "prisma-fmt: Unsupported OS platform: " + platform;
  }
}

// Gets the download URL for a platform
function getFmtDownloadUrl(platform) {
  return "https://s3-eu-west-1.amazonaws.com/prisma-native/alpha/latest/" + platform + "/prisma-fmt";
}

export default function install(fmtPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = getFmtDownloadUrl(getPlatform());
    console.log("prisma-fmt: Downloading from " + url);
    const file = fs.createWriteStream(fmtPath);

    // Fetch fetch fetch.
    https.get(url, function(response) {
      // Did everything go well?
      if(response.statusCode !== 200) {
        reject(response.statusMessage)
      }

      // If so, pipe into our file.
      response.pipe(file);
      file.on('finish', function() {
        fs.chmodSync(fmtPath, '755');
        file.close();
        resolve(fmtPath)
      });
    });
  })
}