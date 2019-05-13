
import { Sandbox } from '../types';

export const getSandboxName = (sandbox: Sandbox) => sandbox.title || sandbox.alias || sandbox.id;
