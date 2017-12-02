const codegen = require('babel-plugin-codegen/macro');

// TODO automate generation:
// babel --plugins babel-macros config/stubs/load-rules.js > config/stubs/load-rules.compiled.js

module.exports = function loadRules() {
  // Create list of require statements of all rules during compile time
  codegen`
    const path = require("path");
    const find = require("shelljs").find;

    let output = "var rules = Object.create(null);\\n";

    find(path.resolve("./node_modules/eslint/lib/rules")).filter(f => path.extname(f) === '.js').forEach((filename) => {
      const basename = path.basename(filename, '.js');

      output += \`rules["\${basename}"] = require("eslint/lib/rules/\${basename}");\\n\`
    });

    output += "\\n return rules;\\n";

    module.exports = output;
  `;
};
