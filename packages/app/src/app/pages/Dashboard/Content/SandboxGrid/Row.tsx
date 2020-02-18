import React, { FunctionComponent, HTMLAttributes, MouseEvent } from 'react';
import { TableRowProps } from 'react-virtualized';

const noop = () => undefined;

type Props = {
  id: string;
  selectSandboxes: (
    ids: string[],
    options: { additive: boolean; range: boolean }
  ) => void;
} & Omit<TableRowProps, 'isScrolling'> &
  Pick<HTMLAttributes<HTMLDivElement>, 'id'>;
export const Row: FunctionComponent<Props> = ({
  className,
  columns,
  id,
  index,
  key,
  onRowClick,
  onRowDoubleClick,
  onRowMouseOut,
  onRowMouseOver,
  onRowRightClick,
  rowData,
  selectSandboxes,
  style,
}) => {
  const onMouseDown = ({
    metaKey,
    shiftKey,
    ...event
  }: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    selectSandboxes([id], {
      additive: metaKey,
      range: shiftKey,
    });
  };
  const a11yProps = {
    'aria-label': 'row',
    onClick: onRowClick
      ? (event: MouseEvent<HTMLDivElement>) =>
          onRowClick({ event, index, rowData })
      : noop,
    onContextMenu: onRowRightClick
      ? (event: MouseEvent<HTMLDivElement>) =>
          onRowRightClick({ event, index, rowData })
      : noop,
    onDoubleClick: onRowDoubleClick
      ? (event: MouseEvent<HTMLDivElement>) =>
          onRowDoubleClick({ event, index, rowData })
      : noop,
    onMouseDown,
    onMouseOut: onRowMouseOut
      ? (event: MouseEvent<HTMLDivElement>) =>
          onRowMouseOut({ event, index, rowData })
      : noop,
    onMouseOver: onRowMouseOver
      ? (event: MouseEvent<HTMLDivElement>) =>
          onRowMouseOver({ event, index, rowData })
      : noop,
    tabIndex: 0,
  };

  return (
    <div
      {...a11yProps}
      className={className}
      id={id}
      key={key}
      role="row"
      style={style}
    >
      {columns}
    </div>
  );
};
