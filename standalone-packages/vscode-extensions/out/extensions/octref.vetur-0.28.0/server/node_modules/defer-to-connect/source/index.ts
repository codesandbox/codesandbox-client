import {Socket} from 'net';
import {TLSSocket} from 'tls';

interface Listeners {
	connect?: () => void;
	secureConnect?: () => void;
	close?: (hadError: boolean) => void;
}

const deferToConnect = (socket: Socket | TLSSocket, fn: Listeners | (() => void)): void => {
	let listeners: Listeners;

	if (typeof fn === 'function') {
		const connect = fn;
		listeners = {connect};
	} else {
		listeners = fn;
	}

	const hasConnectListener = typeof listeners.connect === 'function';
	const hasSecureConnectListener = typeof listeners.secureConnect === 'function';
	const hasCloseListener = typeof listeners.close === 'function';

	const onConnect = (): void => {
		if (hasConnectListener) {
			listeners.connect!();
		}

		if (socket instanceof TLSSocket && hasSecureConnectListener) {
			if (socket.authorized) {
				listeners.secureConnect!();
			} else {
				socket.once('secureConnect', listeners.secureConnect!);
			}
		}

		if (hasCloseListener) {
			socket.once('close', listeners.close!);
		}
	};

	if (socket.writable && !socket.connecting) {
		onConnect();
	} else if (socket.connecting) {
		socket.once('connect', onConnect);
	} else if (socket.destroyed && hasCloseListener) {
		listeners.close!((socket as Socket & {_hadError: boolean})._hadError);
	}
};

export default deferToConnect;

// For CommonJS default export support
module.exports = deferToConnect;
module.exports.default = deferToConnect;
