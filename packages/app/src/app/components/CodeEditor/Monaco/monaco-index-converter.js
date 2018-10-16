export function lineAndColumnToIndex(lines, lineNumber, column) {
  let currentLine = 0;
  let index = 0;

  while (currentLine + 1 < lineNumber) {
    index += lines[currentLine].length;
    index += 1; // Linebreak character
    currentLine += 1;
  }

  index += column - 1;

  return index;
}

export function indexToLineAndColumn(lines, index) {
  let offset = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (offset + line.length + 1 > index) {
      return {
        lineNumber: i + 1,
        column: index - offset + 1,
      };
    }

    // + 1 is for the linebreak character which is not included
    offset += line.length + 1;
  }

  // +2 for column (length is already a +1), because +1 for Monaco and +1 for linebreak
  return {
    lineNumber: lines.length,
    column: (lines[lines.length - 1] || '').length + 1,
  };
}
