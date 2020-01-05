import { applyStyles } from '../utils/dom/css';
import {
  suggestionsContainerStyle,
  suggestionsTitleStyle,
  suggestionsButtonStyle,
} from '../styles';

export function createSuggestions(error: SandboxError) {
  const container = document.createElement('div');

  applyStyles(container, suggestionsContainerStyle);

  const title = document.createElement('div');
  title.appendChild(document.createTextNode('Suggested solutions:'));
  applyStyles(title, suggestionsTitleStyle);
  container.appendChild(title);

  error.suggestions.forEach(suggestion => {
    const button = document.createElement('button');
    button.appendChild(document.createTextNode(suggestion.title));
    button.setAttribute('onmouseover', 'this.style.backgroundColor="#78CDF7"');
    button.setAttribute(
      'onmouseout',
      `this.style.backgroundColor="${suggestionsButtonStyle['background-color']}"`
    );
    applyStyles(button, suggestionsButtonStyle);

    button.addEventListener('click', e => {
      e.preventDefault();
      suggestion.action();
    });

    container.appendChild(button);
  });

  return container;
}
