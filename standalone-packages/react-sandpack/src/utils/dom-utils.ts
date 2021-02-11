import { getThemeStyleSheet } from '../themes';
import { SandpackTheme } from '../types';

export const injectThemeStyleSheet = (
  theme: SandpackTheme,
  themeId: string
) => {
  if (typeof document !== 'undefined') {
    const existingStyleTagForTheme = document.head.querySelector(
      `style[data-sandpack-theme-id=${themeId}]`
    );

    if (!existingStyleTagForTheme) {
      const styleTag = document.createElement('style');
      styleTag.setAttribute('data-sandpack-theme-id', themeId);
      styleTag.textContent = getThemeStyleSheet(theme, themeId);
      document.head.appendChild(styleTag);
    }
  }
};
