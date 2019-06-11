(function() {
	var fs = require('fs');
	var rest = require('rest');
	var when = require('when');

	setTimeout(main, 0);

	function main() {
		var args = process.argv.slice(2);
		if (args.length < 2) {
			console.log("Takes one elm file and one token.");
			return;
		}

		var modules = JSON.parse(readFile("elm-stuff/exact-dependencies.json"));
		var packages = [];
		for (var module in modules) {
			packages.push({name: module, version: modules[module]});
		}

		when.all(pullDocs(packages)).done(function() {
			var worker = Elm.worker(Elm.Main, {
				code: readFile(args[0]),
				token: args[1],
				docs: loadDocs(packages),
			});

			console.log(worker.ports.response);
		});
	}

	function readFile(relPath) {
		return fs.readFileSync(relPath, {"encoding": "utf8"});
	}

	function pullDocs(packages) {
		var docs = [];

		for (var i in packages) {
			var pack = packages[i];
			var docPath = "elm-stuff/packages/" + pack.name + "/" + pack.version + "/documentation.json";

			try {
				fs.lstatSync(docPath);
			} catch (e) {
				var httpPath = "http://package.elm-lang.org/packages/" + pack.name + "/" + pack.version + "/documentation.json";
				docs.push(rest(httpPath).then(function(response) {
					var dp = "elm-stuff" + response.raw.request.path;
					fs.writeFileSync(dp, response.entity);
				}));
			}
		}

		return docs;
	}

	function loadDocs(packages) {
		var docs = [];
		for (var i in packages) {
			var pack = packages[i];
			var docPath = "elm-stuff/packages/" + pack.name + "/" + pack.version + "/documentation.json";
			docs.push([pack.name, readFile(docPath)]);
		}

		return docs
	}
})()
