var cp = require('child_process');
var fs = require('fs');
var path = require('path');

cp.execSync('node node_modules/typescript/bin/tsc', {
	cwd: path.join(__dirname, '..')
});

var OUT_FOLDER = path.join(__dirname, '../out');
var RELEASE_FOLDER = path.join(__dirname, '../release');

if (!fs.existsSync(RELEASE_FOLDER)) {
	fs.mkdirSync(RELEASE_FOLDER);
}

var sources = [
	'onigLibs.js',
	'utils.js',
	'theme.js',
	'matcher.js',
	'debug.js',
	'json.js',
	'plist.js',
	'grammarReader.js',
	'rule.js',
	'grammar.js',
	'registry.js',
	'main.js'
].map(function(sourceFile) {
	var name = './' + sourceFile.replace(/\.js$/, '');
	var sourcePath = path.join(OUT_FOLDER, sourceFile);
	var sourceContents = fs.readFileSync(sourcePath).toString();

	return [
		"$load('" + name + "', function(require, module, exports) {",
		sourceContents,
		"});"
	].join('\n');
});

var all = [];
all.push(fs.readFileSync(path.join(OUT_FOLDER, '_prefix.js')).toString());
all = all.concat(sources);
all.push(fs.readFileSync(path.join(OUT_FOLDER, '_suffix.js')).toString());

fs.writeFileSync(path.join(RELEASE_FOLDER, 'main.js'), all.join('\n'));
fs.writeFileSync(path.join(RELEASE_FOLDER, 'main.d.ts'), fs.readFileSync(path.join(OUT_FOLDER, 'main.d.ts')));
fs.writeFileSync(path.join(RELEASE_FOLDER, 'types.d.ts'), fs.readFileSync(path.join(OUT_FOLDER, 'types.d.ts')));
