/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import { IOnigLib } from './types';
import { Thenable } from './main';

let onigasmLib: Thenable<IOnigLib> = null;
let onigurumaLib: Thenable<IOnigLib> = null;

export function getOnigasm(): Thenable<IOnigLib> {
	if (!onigasmLib) {
		let onigasmModule = require('onigasm');
		const wasmBin = '/public/onigasm/2.1.0/onigasm.wasm';
		onigasmLib = onigasmModule.loadWASM(wasmBin).then((_: any) => {
			return {
				createOnigScanner(patterns: string[]) { return new onigasmModule.OnigScanner(patterns); },
				createOnigString(s: string) { 
					const r = new onigasmModule.OnigString(s);
					
					(<any>r).$str = s;
					return r;
				 }
			};
		});
	}
	return onigasmLib;
}

export function getOniguruma(): Thenable<IOnigLib> {
	if (!onigurumaLib) {
		let getOnigModule : any = (function () {
			var onigurumaModule: any = null;
			return function () {
				if (!onigurumaModule) {
					// CODESANDBOX EDIT
					onigurumaModule = {};
					
				}
				return onigurumaModule;
			};
		})();
		onigurumaLib = Promise.resolve({
			createOnigScanner(patterns: string[]) {
				let onigurumaModule = getOnigModule();
				return new onigurumaModule.OnigScanner(patterns);
			},
			createOnigString(s: string) {
				let onigurumaModule = getOnigModule();
				let string = new onigurumaModule.OnigString(s);
				string.content = s;
				return string;
			}
		});
	}
	return onigurumaLib;
}