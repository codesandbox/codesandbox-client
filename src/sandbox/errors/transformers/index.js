import { registerErrorTransformer } from 'codesandbox-api';

import rawReactErrorTransformer from './raw-react-component-error';

const transformers = [rawReactErrorTransformer];

export default function registerErrorTransformers() {
  transformers.forEach(t => registerErrorTransformer(t));
}
