import { LoaderContext } from '../../../transpiled-module';

export default function getRemainingRequest(loaderContext: LoaderContext) {
  return loaderContext.remainingRequests;
}
