const div = document.createElement('div');
div.style.position = 'fixed';
div.style.backgroundColor = '#6CC7F650';
div.style.border = '1px solid #6CC7F6';
div.style.margin = '-1px';

export function highlightElement(htmlElement: HTMLElement) {
  document.body.appendChild(div);
  const position = htmlElement.getBoundingClientRect();
  div.style.top = position.top + 'px';
  div.style.left = position.left + 'px';
  div.style.width = position.right - position.left + 'px';
  div.style.height = position.bottom - position.top + 'px';
}

export function clearHighlight() {
  document.body.removeChild(div);
}
