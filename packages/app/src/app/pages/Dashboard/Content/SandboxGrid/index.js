import React from 'react';
import { inject, observer } from 'mobx-react';

import moment from 'moment';
import { uniq } from 'lodash-es';
import { basename } from 'path';
import { camelizeKeys } from 'humps';

import track from '@codesandbox/common/lib/utils/analytics';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import Grid from 'react-virtualized/dist/commonjs/Grid';
import Column from 'react-virtualized/dist/commonjs/Table/Column';
import Table from 'react-virtualized/dist/commonjs/Table';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import downloadZip from 'app/store/providers/Utils/create-zip';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import 'react-virtualized/styles.css';

import SandboxItem from '../SandboxCard';
import { PADDING } from '../SandboxCard/elements';
import Selection, { getBounds } from '../Selection';
import { Content, StyledRow } from './elements';
import DragLayer from '../DragLayer';

import {
  deleteSandboxes,
  permanentlyDeleteSandboxes,
  setSandboxesPrivacy,
  undeleteSandboxes,
} from '../../queries';

type State = {
  selection: ?{
    startX: number,
    startY: number,
    endX: number,
    endY: number,
  },
};

const BASE_WIDTH = 300;
const BASE_HEIGHT = 242;
const IS_TABLE = false;

const diff = (a, b) => (a > b ? a - b : b - a);

class SandboxGrid extends React.Component<*, State> {
  state = {
    selection: undefined,
  };

  loadedSandboxes = {};

  setSandboxesSelected = (ids, { additive = false, range = false } = {}) => {
    const { store, sandboxes, signals } = this.props;
    const selectedSandboxes = store.dashboard.selectedSandboxes;
    if (range === true) {
      track('Dashboard - Sandbox Shift Selection');
      const indexedSandboxes = sandboxes.map((sandbox, i) => ({ sandbox, i }));

      // We need to select a range
      const firstIndexInfo = indexedSandboxes.find(
        ({ sandbox }) => selectedSandboxes.indexOf(sandbox.id) > -1
      );

      const [id] = ids;

      const lastIndexInfo = indexedSandboxes.find(
        ({ sandbox }) => sandbox.id === id
      );

      if (firstIndexInfo && lastIndexInfo) {
        const indexes = [firstIndexInfo.i, lastIndexInfo.i].sort();
        const sandboxIds = indexedSandboxes
          .map(({ sandbox }) => sandbox.id)
          .slice(indexes[0], indexes[1] + 1);

        signals.dashboard.sandboxesSelected({
          sandboxIds,
        });
        return;
      }
    }

    let sandboxIds = ids;

    if (additive) {
      track('Dashboard - Sandbox Additive Selection');
      sandboxIds = store.dashboard.selectedSandboxes.filter(
        id => ids.indexOf(id) === -1
      );
      const additiveIds = ids.filter(
        id => store.dashboard.selectedSandboxes.indexOf(id) === -1
      );

      sandboxIds = uniq([...sandboxIds, ...additiveIds]);
    }

    signals.dashboard.sandboxesSelected({
      sandboxIds,
    });
  };

  deleteSandboxes = () => {
    const collections = uniq(
      this.props.sandboxes
        .filter(sandbox => this.selectedSandboxesObject[sandbox.id])
        .map(s => s.collection)
    );
    deleteSandboxes(this.props.store.dashboard.selectedSandboxes, collections);
  };

  undeleteSandboxes = () => {
    undeleteSandboxes(this.props.store.dashboard.selectedSandboxes);
  };

  permanentlyDeleteSandboxes = () => {
    permanentlyDeleteSandboxes(this.props.store.dashboard.selectedSandboxes);
  };

  setSandboxesPrivacy = (privacy: number) => {
    setSandboxesPrivacy(this.props.store.dashboard.selectedSandboxes, privacy);
  };

  getSandbox = async sandboxId => {
    if (this.loadedSandboxes[sandboxId]) {
      return Promise.resolve(this.loadedSandboxes[sandboxId]);
    }

    return fetch(`${protocolAndHost()}/api/v1/sandboxes/${sandboxId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('jwt'))}`,
      },
    })
      .then(x => x.json())
      .then(x => {
        const data = camelizeKeys(x.data);
        this.loadedSandboxes[data.id] = data;
        return data;
      });
  };

  exportSandboxes = async () => {
    const sandboxIds = uniq(
      this.props.sandboxes
        .filter(sandbox => this.selectedSandboxesObject[sandbox.id])
        .map(s => s.id)
    );
    const sandboxes = await Promise.all(
      sandboxIds.map(s => this.getSandbox(s))
    );
    return Promise.all(
      sandboxes.map(s => downloadZip(s, s.modules, s.directories))
    );
  };

  onMouseDown = (event: MouseEvent) => {
    this.setState({
      selection: {
        startX: event.clientX,
        startY: event.clientY,
        endX: event.clientX,
        endY: event.clientY,
      },
    });

    if (!event.metaKey) {
      this.setSandboxesSelected([]);
    }

    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  };

  onMouseUp = () => {
    if (
      this.state.selection &&
      (diff(this.state.selection.startX, this.state.selection.endX) > 50 ||
        diff(this.state.selection.startY, this.state.selection.endY) > 50)
    ) {
      track('Dashboard - Sandbox Selection Done');
    }

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
    this.setState({
      selection: undefined,
    });
  };

  onMouseMove = event => {
    if (this.state.selection) {
      const newSelection = {
        ...this.state.selection,
        endX: event.clientX,
        endY: event.clientY,
      };
      this.setState({
        selection: newSelection,
      });

      const sandboxes = document.querySelectorAll('.sandbox-item');
      const selectedSandboxes = [];
      const selection = getBounds(
        newSelection.startX,
        newSelection.startY,
        newSelection.endX,
        newSelection.endY
      );

      // eslint-disable-next-line no-restricted-syntax
      for (const sandbox of sandboxes) {
        const { top, height, left, width } = sandbox.getBoundingClientRect();
        const padding = IS_TABLE ? 0 : PADDING;
        const boxWidth = width - padding;
        const boxHeight = height - padding;

        if (
          (left >= selection.left || left + boxWidth >= selection.left) &&
          left <= selection.left + selection.width &&
          (top >= selection.top || top + boxHeight >= selection.top) &&
          top <= selection.top + selection.height
        ) {
          selectedSandboxes.push(sandbox);
        }
      }

      this.setSandboxesSelected(selectedSandboxes.map(el => el.id), {
        additive: event.metaKey,
      });
    }
  };
  isScrolling = () => this.scrolling;

  cellRenderer = ({ rowIndex, columnIndex, key, style, isScrolling }) => {
    this.scrolling = isScrolling;

    let index = rowIndex * this.columnCount + columnIndex;
    const { sandboxes, signals } = this.props;

    if (this.props.ExtraElement) {
      if (index === 0) {
        return <this.props.ExtraElement key="extra" style={style} />;
      }

      index--;
    }

    if (index > sandboxes.length - 1) {
      return null;
    }

    const item = sandboxes[index];

    const getOrder = () => {
      if (item.removedAt) {
        return `Deleted ${moment.utc(item.removedAt).fromNow()}`;
      }

      const orderField = this.props.store.dashboard.orderBy.field;
      if (orderField === 'insertedAt') {
        return `Created ${moment.utc(item.insertedAt).fromNow()}`;
      }

      return `Edited ${moment.utc(item.updatedAt).fromNow()}`;
    };

    let editedSince = getOrder();

    if (this.props.page === 'search' || this.props.page === 'recent') {
      const dir =
        basename(item.collection.path) ||
        (item.collection.teamId ? 'Our Sandboxes' : 'My Sandboxes');

      if (dir) {
        editedSince += ` in ${dir}`;
      }
    }

    return (
      <SandboxItem
        isScrolling={this.isScrolling}
        id={item.id}
        title={getSandboxName(item)}
        alias={item.alias}
        color={item.color}
        details={editedSince}
        style={style}
        key={key}
        sandbox={item}
        template={item.source.template}
        removedAt={item.removedAt}
        selected={this.selectedSandboxesObject[item.id]}
        selectedCount={this.props.store.dashboard.selectedSandboxes.length}
        setSandboxesSelected={this.setSandboxesSelected}
        setDragging={signals.dashboard.dragChanged}
        isDraggingItem={
          this.isDragging && this.selectedSandboxesObject[item.id]
        }
        collectionPath={item.collection.path}
        collectionTeamId={item.collection.teamId}
        deleteSandboxes={this.deleteSandboxes}
        undeleteSandboxes={this.undeleteSandboxes}
        permanentlyDeleteSandboxes={this.permanentlyDeleteSandboxes}
        exportSandboxes={this.exportSandboxes}
        setSandboxesPrivacy={this.setSandboxesPrivacy}
        page={this.props.page}
        privacy={item.privacy}
        isPatron={this.props.store.isPatron}
        screenshotUrl={item.screenshotUrl}
      />
    );
  };

  rowRenderer = props => {
    const selected = this.selectedSandboxesObject[props.rowData.id];
    return (
      <StyledRow
        {...props}
        selected={selected}
        className={`sandbox-item ${props.className}`}
        id={props.rowData.id}
        selectSandboxes={this.setSandboxesSelected}
      />
    );
  };

  render() {
    const { selection } = this.state;
    const { sandboxes, store } = this.props;

    const { selectedSandboxes } = this.props.store.dashboard;
    let sandboxCount = sandboxes.length;

    this.isDragging = store.dashboard.isDragging;
    this.selectedSandboxesObject = {};
    // Create an object to make it O(1)
    selectedSandboxes.forEach(id => {
      this.selectedSandboxesObject[id] = true;
    });

    return (
      <Content style={{ overflowX: 'hidden' }} onMouseDown={this.onMouseDown}>
        <DragLayer />
        <AutoSizer>
          {({ width, height }) => {
            if (this.props.ExtraElement) {
              sandboxCount += 1;
            }

            const columnCount = Math.max(
              1,
              Math.floor(width / (BASE_WIDTH + PADDING))
            );
            const rowCount = Math.ceil(sandboxCount / columnCount);
            const columnWidth = width / columnCount;
            this.columnCount = columnCount;

            if (IS_TABLE) {
              return (
                <Table
                  style={{ outline: 'none' }}
                  gridStyle={{ outline: 'none' }}
                  width={width - 32}
                  height={height}
                  headerHeight={40}
                  rowHeight={40}
                  rowCount={sandboxCount}
                  rowRenderer={this.rowRenderer}
                  rowGetter={({ index }) => sandboxes[index]}
                  headerStyle={{
                    color: 'white',
                  }}
                  rowStyle={{
                    fontSize: '.875rem',
                  }}
                >
                  <Column
                    label="Title"
                    dataKey="title"
                    cellDataGetter={({ rowData }) =>
                      rowData.title || rowData.id
                    }
                    width={200}
                  />
                  <Column
                    label="Description"
                    dataKey="description"
                    width={300}
                  />
                  <Column
                    label="Last Updated"
                    dataKey="updatedAt"
                    cellDataGetter={({ rowData }) =>
                      moment.utc(rowData.updatedAt).fromNow()
                    }
                    width={150}
                  />
                  <Column
                    label="Created"
                    dataKey="insertedAt"
                    cellDataGetter={({ rowData }) =>
                      moment.utc(rowData.insertedAt).fromNow()
                    }
                    width={150}
                  />
                  <Column
                    label="Template"
                    dataKey="source.template"
                    cellDataGetter={({ rowData }) => rowData.source.template}
                    width={150}
                  />
                </Table>
              );
            }

            return (
              <Grid
                style={{ outline: 'none', overflowX: 'hidden' }}
                cellCount={sandboxCount}
                cellRenderer={this.cellRenderer}
                width={width}
                height={height}
                rowCount={rowCount}
                columnCount={columnCount}
                columnWidth={columnWidth}
                rowHeight={BASE_HEIGHT}
              />
            );
          }}
        </AutoSizer>

        {selection && <Selection {...this.state.selection} />}
      </Content>
    );
  }
}

export default inject('store', 'signals')(observer(SandboxGrid));
