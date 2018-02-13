export default function getRemainingRequest(loaderContext) {
  if (loaderContext.remainingRequests) return loaderContext.remainingRequests;
  const request = loaderContext.loaders
    .slice(loaderContext.loaderIndex + 1)
    .map(obj => obj.request)
    .concat([loaderContext.resource]);
  return request.join('!');
}
