import { indexToLineAndColumn } from 'app/utils/monaco-index-converter';
import { css } from 'glamor';

const fadeIn = css.keyframes('fadeIn', {
  // optional name
  '0%': { opacity: 0 },
  '100%': { opacity: 1 },
});

const fadeOut = css.keyframes('fadeOut', {
  // optional name
  '0%': { opacity: 1 },
  '100%': { opacity: 0 },
});

const userClassesGenerated = {};
const userSelectionDecorations = {};

export function updateUserSelections(
  monaco,
  editor,
  currentModule,
  userSelections: Array<
    | {
        userId: string,
        selection: null,
      }
    | {
        userId: string,
        name: string,
        selection: any,
        color: Array<number>,
      }
  >
) {
  if (!editor.getModel()) {
    return;
  }

  const lines = editor.getModel().getLinesContent() || [];

  userSelections.forEach(data => {
    const { userId } = data;

    const decorationId = currentModule.shortid + userId;
    if (data.selection === null) {
      userSelectionDecorations[decorationId] = editor.deltaDecorations(
        userSelectionDecorations[decorationId] || [],
        [],
        data.userId
      );

      return;
    }

    const decorations = [];
    const { selection, color, name } = data;

    if (selection) {
      const addCursor = (position, className) => {
        const cursorPos = indexToLineAndColumn(lines, position);

        decorations.push({
          range: new monaco.Range(
            cursorPos.lineNumber,
            cursorPos.column,
            cursorPos.lineNumber,
            cursorPos.column
          ),
          options: {
            className: userClassesGenerated[className],
          },
        });
      };

      const addSelection = (start, end, className) => {
        const from = indexToLineAndColumn(lines, start);
        const to = indexToLineAndColumn(lines, end);

        decorations.push({
          range: new monaco.Range(
            from.lineNumber,
            from.column,
            to.lineNumber,
            to.column
          ),
          options: {
            className: userClassesGenerated[className],
          },
        });
      };

      const prefix = color.join('-') + userId;
      const cursorClassName = prefix + '-cursor';
      const secondaryCursorClassName = prefix + '-secondary-cursor';
      const selectionClassName = prefix + '-selection';
      const secondarySelectionClassName = prefix + '-secondary-selection';

      if (!userClassesGenerated[cursorClassName]) {
        const nameStyles = {
          content: name,
          position: 'absolute',
          top: -17,
          backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
          zIndex: 20,
          color:
            color[0] + color[1] + color[2] > 500
              ? 'rgba(0, 0, 0, 0.8)'
              : 'white',
          padding: '2px 4px',
          borderRadius: 2,
          borderBottomLeftRadius: 0,
          fontSize: '.75rem',
          fontWeight: 600,
          userSelect: 'none',
          pointerEvents: 'none',
          width: 'max-content',
        };
        userClassesGenerated[cursorClassName] = `${css({
          backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.8)`,
          width: '2px !important',
          cursor: 'text',
          zIndex: 30,
          ':before': {
            animation: `${fadeOut} 0.3s`,
            animationDelay: '1s',
            animationFillMode: 'forwards',
            opacity: 1,
            ...nameStyles,
          },
          ':hover': {
            ':before': {
              animation: `${fadeIn} 0.3s`,
              animationFillMode: 'forwards',
              opacity: 0,
              ...nameStyles,
            },
          },
        })}`;
      }

      if (!userClassesGenerated[secondaryCursorClassName]) {
        userClassesGenerated[secondaryCursorClassName] = `${css({
          backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`,
          width: '2px !important',
        })}`;
      }

      if (!userClassesGenerated[selectionClassName]) {
        userClassesGenerated[selectionClassName] = `${css({
          backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.3)`,
          borderRadius: '3px',
          minWidth: 7.6,
        })}`;
      }

      if (!userClassesGenerated[secondarySelectionClassName]) {
        userClassesGenerated[secondarySelectionClassName] = `${css({
          backgroundColor: `rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.2)`,
          borderRadius: '3px',
          minWidth: 7.6,
        })}`;
      }

      addCursor(selection.primary.cursorPosition, cursorClassName);
      if (selection.primary.selection.length) {
        addSelection(
          selection.primary.selection[0],
          selection.primary.selection[1],
          selectionClassName
        );
      }

      if (selection.secondary.length) {
        selection.secondary.forEach(s => {
          addCursor(s.cursorPosition, secondaryCursorClassName);

          if (s.selection.length) {
            addSelection(
              s.selection[0],
              s.selection[1],
              secondarySelectionClassName
            );
          }
        });
      }
    }

    // Allow new model to attach in case it's attaching
    requestAnimationFrame(() => {
      userSelectionDecorations[decorationId] = editor.deltaDecorations(
        userSelectionDecorations[decorationId] || [],
        decorations,
        userId
      );
    });
  });
}
