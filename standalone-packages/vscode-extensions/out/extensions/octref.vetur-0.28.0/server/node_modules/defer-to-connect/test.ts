import {connect} from 'net';
import {connect as secureConnect} from 'tls';
import test from 'ava';
import pEvent from 'p-event';
import deferToConnect from './source';

const delay = async (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

test('connect listener - socket has been already connected', async t => {
	let called = false;
	const socket = connect(53, '8.8.8.8');

	await pEvent(socket, 'connect');
	deferToConnect(socket, () => {
		called = true;
	});

	t.true(called);
});

test('connect listener - socket hasn\'t been connected yet', async t => {
	let called = false;
	const socket = connect(53, '8.8.8.8');

	deferToConnect(socket, () => {
		called = true;
	});

	await pEvent(socket, 'connect');

	t.true(called);
});

test('connect listener - not executed, socket has been disconnected', async t => {
	let called = false;

	const socket = connect(53, '8.8.8.8');
	await pEvent(socket, 'connect');
	socket.end();

	/* istanbul ignore next: this is on purpose */
	deferToConnect(socket, () => {
		called = true;
	});

	t.false(called);
});

test('connect listener - as a Listener property', async t => {
	let called = false;
	const socket = connect(53, '8.8.8.8');

	await pEvent(socket, 'connect');
	deferToConnect(socket, {
		connect: () => {
			called = true;
		}
	});

	t.true(called);
});

test('close listener - socket has been already connected', async t => {
	let called = false;
	const socket = connect(53, '8.8.8.8');

	await pEvent(socket, 'connect');
	deferToConnect(socket, {
		close: () => {
			called = true;
		}
	});

	socket.destroy();

	await delay(1);

	t.true(called);
});

test('close listener - socket has been already closed', async t => {
	let called = false;
	const socket = connect(53, '8.8.8.8');

	await pEvent(socket, 'connect');
	socket.destroy();

	deferToConnect(socket, {
		close: () => {
			called = true;
		}
	});

	t.true(called);
});

test('secureConnect listener - socket has been already securely connected', async t => {
	let called = false;
	const socket = secureConnect(443, 'example.com');

	await pEvent(socket, 'secureConnect');
	deferToConnect(socket, {
		secureConnect: () => {
			called = true;
		}
	});

	t.true(called);
});

test('secureConnect listener - socket hasn\'t been securely connected yet', async t => {
	let called = false;
	const socket = secureConnect(443, 'example.com');

	deferToConnect(socket, {
		secureConnect: () => {
			called = true;
		}
	});

	await pEvent(socket, 'secureConnect');

	t.true(called);
});

test('secureConnect listener - not executed, socket has been disconnected', async t => {
	let called = false;

	const socket = secureConnect(443, 'example.com');
	await pEvent(socket, 'secureConnect');
	socket.end();

	/* istanbul ignore next: this is on purpose */
	deferToConnect(socket, () => {
		called = true;
	});

	t.false(called);
});
