export function createDiff(textA, textB) {
  const linesA = textA.split('\n');
  const linesB = textB.split('\n');
  const lineCount = Math.max(linesA.length, linesB.length);

  let result: string[] = [];
  let currentConflict: { a: string[]; b: string[] } | null = null;

  function closeConflict(line) {
    result = result.concat(
      '<<<<<<< CodeSandbox',
      currentConflict!.a,
      '=======',
      currentConflict!.b,
      '>>>>>>> GitHub',
      line
    );
    currentConflict = null;
  }

  for (let x = 0; x < lineCount; x++) {
    if (x in linesA && x in linesB && linesA[x] !== linesB[x]) {
      if (currentConflict && linesA[x + 1] === linesB[x]) {
        closeConflict(linesA[x]);
        linesB.splice(x, 0, linesA[x]);
      } else if (currentConflict && linesA[x] === linesB[x + 1]) {
        closeConflict(linesB[x]);
        currentConflict = null;
        linesA.splice(x, 0, linesB[x]);
      } else if (currentConflict) {
        currentConflict.a.push(linesA[x]);
        currentConflict.b.push(linesB[x]);
      } else {
        currentConflict = {
          a: [linesA[x]],
          b: [linesB[x]],
        };
      }
    } else if (x in linesA && !(x in linesB)) {
      if (currentConflict) {
        closeConflict(linesA[x]);
      } else {
        result.push(linesA[x]);
      }
    } else if (!(x in linesA) && x in linesB) {
      if (currentConflict) {
        closeConflict(linesB[x]);
      } else {
        result.push(linesB[x]);
      }
    } else if (currentConflict) {
      closeConflict(linesA[x]);
    } else {
      result.push(linesA[x]);
    }
  }

  return result.join('\n');
}
