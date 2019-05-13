
import { Sandbox } from '../types';

export default (sandbox: Sandbox) => sandbox.title || sandbox.alias || sandbox.id;
