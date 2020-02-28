#!/usr/bin/env node

require("./lib/index.cjs")
	.cli()
	.catch(console.log);
