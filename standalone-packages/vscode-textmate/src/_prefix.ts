/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

interface IModule {
	exports: any;
}

interface IModuleMap {
	[path: string]: IModule;
}

interface IFactoryFunc {
	(require: IFactoryRequireFunc, module: IModule, exports: any): void;
}

interface IFactoryRequireFunc {
	(name: string): any;
}

let $map: IModuleMap = {};

function $load(name: string, factory: IFactoryFunc) {
	let mod: IModule = {
		exports: {}
	};

	let requireFunc: IFactoryRequireFunc = (mod) => {
		if ($map[mod]) {
			return $map[mod].exports;
		}
		return require(mod);
	};

	factory.call(this, requireFunc, mod, mod.exports);

	$map[name] = mod;
}
