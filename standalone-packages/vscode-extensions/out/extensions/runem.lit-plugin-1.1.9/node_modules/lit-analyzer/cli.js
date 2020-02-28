#!/usr/bin/env node

require("./lib/index.cjs")
	.cli()
	// eslint-disable-next-line no-console
	.catch(console.log);
