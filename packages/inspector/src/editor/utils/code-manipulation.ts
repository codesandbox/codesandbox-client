export enum InitializerType {
  String,
  Expression,
  Boolean,
}

function createProp(propName: string, initializerType: InitializerType) {
  const base = `${propName}`;

  switch (initializerType) {
    case InitializerType.Boolean:
      return base;
    case InitializerType.Expression:
      return `${base}={}`;
    case InitializerType.String:
      return `${base}=""`;
  }
}

/**
 * Returns the spaces (or tabs) the line starts with
 */
function getPadding(line: string | undefined): string {
  if (!line) {
    return '';
  }

  const matcher = /(\s*)/;
  const result = line.match(matcher);
  if (result && result[0]) {
    return result[0];
  } else {
    return '';
  }
}

export function addProp(
  oldCode: string,
  propName: string,
  initializerType: InitializerType
) {
  const lines = oldCode.split('\n');
  const lastLine = lines[lines.length - 1];
  const isSingleLine = lines.length === 1;
  const isSelfClosing = /\s?\/\s*>$/.test(lastLine);
  const ending = isSelfClosing ? /\s?\/\s*>/ : /\s?>/;
  const closeIsOwnLine = /^\s*\/?\s*>$/.test(lastLine);

  // Multiline component
  const padding = getPadding(lines[1]);

  if (closeIsOwnLine || !isSingleLine) {
    lines.splice(
      lines.length - 1,
      0,
      padding + createProp(propName, initializerType)
    );
  } else {
    lines[lines.length - 1] = lastLine.replace(
      ending,
      ' ' +
        createProp(propName, initializerType) +
        (isSelfClosing ? ' />' : '>')
    );
  }

  return lines.join('\n');
}
