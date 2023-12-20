export function injectLinkPrefetch(url: string) {
  // generate link prefetch tag
  const linkTag = document.createElement('link');
  linkTag.rel = 'preload';
  linkTag.href = url;
  linkTag.as = 'document';

  // inject tag in the head of the document
  document.head.appendChild(linkTag);
}
