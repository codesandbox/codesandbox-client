/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import { IOnigLib } from './types';
import { Thenable } from './main';

let onigasmLib: Thenable<IOnigLib> = null;
let onigurumaLib: Thenable<IOnigLib> = null;

async function getWasm() {
	const wasmPath = '/public/vscode-oniguruma/1.3.1/onig.wasm';

	const response = await fetch(wasmPath);

	return response.arrayBuffer();
}

export async function getOnigasm(): Promise<IOnigLib> {
	if (!onigasmLib) {
		const onigasmModule = require('vscode-oniguruma');
		const wasmBin = await getWasm()
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
