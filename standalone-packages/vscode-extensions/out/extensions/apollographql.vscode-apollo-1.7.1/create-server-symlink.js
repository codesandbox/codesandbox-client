const symlinkDir = require("symlink-dir");

symlinkDir(
  "../apollo-language-server",
  "./node_modules/apollo-language-server"
).then(result => {
  console.log(result);
});
