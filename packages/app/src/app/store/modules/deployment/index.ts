import { Module } from '@cerebral/fluent';
import * as sequences from './sequences';
import { State } from './types';

const state: State = {
    deploying: false,
    url: null
};

const signals = {
    deployClicked: sequences.deploy,
    deploySandboxClicked: sequences.openDeployModal
};

export default Module<State, typeof signals>({
    state,
    signals
});
