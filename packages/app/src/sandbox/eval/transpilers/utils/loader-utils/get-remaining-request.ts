import { LoaderContext } from 'sandbox/eval/transpiled-module';

export default function getRemainingRequest(loaderContext: LoaderContext) {
  return loaderContext.remainingRequests;
}
