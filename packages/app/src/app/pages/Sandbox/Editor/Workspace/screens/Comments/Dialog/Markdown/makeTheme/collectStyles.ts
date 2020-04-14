import { mapScope } from './scopeMapper';
import { getScoreForScope } from './scopeScore';
import { transformSettings } from './transformSettings';
import { minify } from './minify';

export const collectAllSettings = tokenColors => {
  const output = {};

  tokenColors.forEach(({ scope, settings }) => {
    // We only care about colouring here
    if (!settings.foreground && !settings.fontStyle) {
      return;
    }

    const normScope = typeof scope === 'string' ? [scope] : scope;
    // Return when no input scopes are present
    if (!normScope || !normScope.length) {
      return;
    }

    normScope.forEach(scopeName => {
      const mappedScope = mapScope(scopeName);
      // Return when no mapping scope has been returned
      if (!mappedScope) {
        return;
      }

      if (output[mappedScope] === undefined) {
        output[mappedScope] = [];
      }

      output[mappedScope].push({
        scope: scopeName,
        settings,
      });
    });
  });

  const styles = Object.keys(output).map(mappedScope => {
    const matchesArr = output[mappedScope];

    // Get score for each match
    const scored = matchesArr.map(match => {
      const score = getScoreForScope(match.scope, mappedScope);

      return {
        score,
        scope: mappedScope,
        settings: transformSettings(match.settings),
      };
    });

    // Sort by score asc
    const sorted = scored.sort((a, b) => b.score - a.score);

    // Return highest-scored one
    return sorted[0];
  });

  const themeStyles = minify(styles);

  return {
    styles: themeStyles,
  };
};
