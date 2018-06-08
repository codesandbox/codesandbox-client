/** @flow */
import * as React from 'react';

/**
 * Default row renderer for Table.
 */
export default function defaultRowRenderer({
  className,
  columns,
  index,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  selectSandboxes,
  rowData,
  style,
  id,
}) {
  const a11yProps = {};

  a11yProps['aria-label'] = 'row';
  a11yProps.tabIndex = 0;

  if (onRowClick) {
    a11yProps.onClick = event => onRowClick({ event, index, rowData });
  }
  if (onRowDoubleClick) {
    a11yProps.onDoubleClick = event =>
      onRowDoubleClick({ event, index, rowData });
  }
  if (onRowMouseOut) {
    a11yProps.onMouseOut = event => onRowMouseOut({ event, index, rowData });
  }
  if (onRowMouseOver) {
    a11yProps.onMouseOver = event => onRowMouseOver({ event, index, rowData });
  }
  if (onRowRightClick) {
    a11yProps.onContextMenu = event =>
      onRowRightClick({ event, index, rowData });
  }

  return (
    <div
      {...a11yProps}
      onMouseDown={e => {
        e.preventDefault();
        e.stopPropagation();

        selectSandboxes([id], { additive: e.metaKey, range: e.shiftKey });
      }}
      className={className}
      key={key}
      role="row"
      style={style}
      id={id}
      tabIndex="0"
    >
      {columns}
    </div>
  );
}
