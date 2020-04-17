import 'react-virtualized/styles.css';

import { basename } from 'path';

import track from '@codesandbox/common/lib/utils/analytics';
import { getSandboxName } from '@codesandbox/common/lib/utils/get-sandbox-name';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { makeTemplates } from 'app/components/CreateNewSandbox/queries';
import downloadZip from 'app/overmind/effects/zip/create-zip';
import { formatDistanceToNow } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { camelizeKeys } from 'humps';
import { uniq } from 'lodash-es';
import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import Grid from 'react-virtualized/dist/commonjs/Grid';
import Table from 'react-virtualized/dist/commonjs/Table';
import Column from 'react-virtualized/dist/commonjs/Table/Column';

import { SandboxFragment } from 'app/graphql/types';
import { Sandbox } from '@codesandbox/common/lib/types';
import {
  deleteSandboxes,
  permanentlyDeleteSandboxes,
  setSandboxesPrivacy,
  undeleteSandboxes,
} from '../../queries';
import { DragLayer } from '../DragLayer';
import { SandboxItem } from '../SandboxCard';
import { PADDING } from '../SandboxCard/elements';
import { Selection, getBounds } from '../Selection';
import { Content, StyledRow } from './elements';

type State = {
  selection:
    | {
        startX: number;
        startY: number;
        endX: number;
        endY: number;
      }
    | undefined;
  localSandboxesSelected: string[] | null;
};

const BASE_WIDTH = 300;
const BASE_HEIGHT = 242;
const IS_TABLE = false;

const diff = (a, b) => (a > b ? a - b : b - a);
const distanceInWordsToNow = date =>
  formatDistanceToNow(zonedTimeToUtc(date, 'Etc/UTC'));

interface ISandboxGridComponentProps {
  page?: 'search' | 'recent';
  ExtraElement: React.ComponentType<{ style?: React.CSSProperties }>;
  sandboxes: SandboxFragment[];
  selectedSandboxes: string[];
  orderByField: string;
  isDragging: boolean;
  isPatron: boolean;
  sandboxesSelected: (params: { sandboxIds: string[] }) => void;
  forkExternalSandbox: (params: { sandboxId: string }) => void;
  dragChanged: (params: { isDragging: boolean }) => void;
}

class SandboxGridComponent extends React.Component<
  ISandboxGridComponentProps,
  State
> {
  state = {
    selection: undefined,
    localSandboxesSelected: null,
  };

  selectedSandboxesObject: { [id: string]: true };
  loadedSandboxes: { [id: string]: Sandbox } = {};
  scrolling: boolean;
  isDragging: boolean;
  columnCount: number;

  getSelectedSandboxIds = () => {
    const { selectedSandboxes: selectedSandboxesFromState } = this.props;
    const { localSandboxesSelected } = this.state;

    return localSandboxesSelected === null
      ? selectedSandboxesFromState
      : localSandboxesSelected;
  };

  commitSandboxesSelected = () => {
    this.props.sandboxesSelected({
      sandboxIds: this.state.localSandboxesSelected || [],
    });
    this.setState({
      localSandboxesSelected: null,
    });
  };

  setSandboxesSelected = (
    ids,
    { additive = false, range = false, delay = false } = {}
  ) => {
    const { sandboxes } = this.props;

    const selectedSandboxes = this.getSelectedSandboxIds();

    const setSelected = (sandboxIds: string[]) => {
      /**
       * If delay is true we don't commit to the store yet, but we keep it in this component.
       * This is for performance reasons when having a selection. On mouseup we commit the selection
       * to the store.
       */
      if (delay) {
        this.setState({
          localSandboxesSelected: sandboxIds,
        });
      } else {
        this.props.sandboxesSelected({
          sandboxIds,
        });
        this.setState({
          localSandboxesSelected: null,
        });
      }
    };

    if (range === true) {
      if (!delay) {
        track('Dashboard - Sandbox Shift Selection');
      }
      const indexedSandboxes = sandboxes.map((sandbox, i) => ({ sandbox, i }));

      // We need to select a range
      const firstIndexInfo = indexedSandboxes.find(({ sandbox }) =>
        selectedSandboxes.includes(sandbox.id)
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

        setSelected(sandboxIds);
        return;
      }
    }

    let sandboxIds = ids;

    if (additive) {
      if (!delay) {
        track('Dashboard - Sandbox Additive Selection');
      }
      sandboxIds = selectedSandboxes.filter(id => !ids.includes(id));
      const additiveIds = ids.filter(id => !selectedSandboxes.includes(id));

      sandboxIds = uniq([...sandboxIds, ...additiveIds]);
    }

    setSelected(sandboxIds);
  };

  makeTemplates = (teamId?: string) => {
    const collections = uniq(
      this.props.sandboxes
        .filter(sandbox => this.selectedSandboxesObject[sandbox.id])
        .map(s => s.collection)
    );

    makeTemplates(this.props.selectedSandboxes, teamId, collections);
  };

  deleteSandboxes = () => {
    const collections = uniq(
      this.props.sandboxes
        .filter(sandbox => this.selectedSandboxesObject[sandbox.id])
        .map(s => s.collection)
    );
    deleteSandboxes(this.props.selectedSandboxes, collections);
  };

  undeleteSandboxes = () => {
    undeleteSandboxes(this.props.selectedSandboxes);
  };

  permanentlyDeleteSandboxes = () => {
    permanentlyDeleteSandboxes(this.props.selectedSandboxes);
  };

  setSandboxesPrivacy = (privacy: 0 | 1 | 2) => {
    track('Sandbox - Update Privacy', {
      privacy,
      source: 'dashboard',
    });
    setSandboxesPrivacy(this.props.selectedSandboxes, privacy);
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
        const data = camelizeKeys(x.data) as Sandbox;
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

  forkSandbox = id => {
    this.props.forkExternalSandbox({ sandboxId: id });
  };

  onMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
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
    this.setState(
      {
        selection: undefined,
      },
      () => {
        this.commitSandboxesSelected();
      }
    );
  };

  onMouseMove = event => {
    if (this.state.selection) {
      const newSelection = {
        ...this.state.selection,
        endX: event.clientX,
        endY: event.clientY,
      };
      // eslint-disable-next-line
      this.setState(state => ({
        selection: newSelection,
      }));

      const sandboxes = document.querySelectorAll('.sandbox-item');
      const selectedSandboxes = [];
      const selection = getBounds(
        newSelection.startX,
        newSelection.startY,
        newSelection.endX,
        newSelection.endY
      );

      /* eslint-disable no-restricted-syntax */
      // @ts-ignore
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
      /* eslint-enable */

      this.setSandboxesSelected(
        selectedSandboxes.map(el => el.id),
        {
          additive: event.metaKey,
          delay: true,
        }
      );
    }
  };

  isScrolling = () => this.scrolling;

  cellRenderer = ({ rowIndex, columnIndex, key, style, isScrolling }) => {
    this.scrolling = isScrolling;

    let index = rowIndex * this.columnCount + columnIndex;
    const { sandboxes, ExtraElement } = this.props;

    if (ExtraElement) {
      if (index === 0) {
        return <ExtraElement key="extra" style={style} />;
      }

      index--;
    }

    if (index > sandboxes.length - 1) {
      return null;
    }

    const item = sandboxes[index];

    const getOrder = () => {
      if (item.removedAt) {
        return `Deleted ${distanceInWordsToNow(item.removedAt)} ago`;
      }

      const orderField = this.props.orderByField;
      if (orderField === 'insertedAt') {
        return `Created ${distanceInWordsToNow(item.insertedAt)} ago`;
      }

      return `Edited ${distanceInWordsToNow(item.updatedAt)} ago`;
    };

    let editedSince = getOrder();

    if (this.props.page === 'search' || this.props.page === 'recent') {
      const dir =
        basename(item.collection.path) ||
        (item.collection.teamId ? 'Team Sandboxes' : 'My Sandboxes');

      if (dir) {
        editedSince += ` in ${dir}`;
      }
    }

    const itemInSelection = this.selectedSandboxesObject[item.id];

    return (
      <SandboxItem
        isScrolling={this.isScrolling}
        id={item.id}
        title={getSandboxName(item)}
        alias={item.alias}
        color={item.forkedTemplate ? item.forkedTemplate.color : undefined}
        details={editedSince}
        style={style}
        key={key}
        sandbox={item}
        // @ts-ignore
        template={item.source.template}
        removedAt={item.removedAt}
        selected={itemInSelection}
        selectedCount={this.props.selectedSandboxes.length}
        setSandboxesSelected={this.setSandboxesSelected}
        setDragging={this.props.dragChanged}
        isDraggingItem={this.isDragging && itemInSelection}
        collectionPath={item.collection.path}
        collectionTeamId={item.collection.teamId}
        forkSandbox={this.forkSandbox}
        deleteSandboxes={this.deleteSandboxes}
        undeleteSandboxes={this.undeleteSandboxes}
        permanentlyDeleteSandboxes={this.permanentlyDeleteSandboxes}
        exportSandboxes={this.exportSandboxes}
        setSandboxesPrivacy={this.setSandboxesPrivacy}
        makeTemplates={this.makeTemplates}
        page={this.props.page}
        privacy={item.privacy}
        isPatron={this.props.isPatron}
        screenshotUrl={item.screenshotUrl}
        screenshotOutdated={item.screenshotOutdated}
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
    const { sandboxes, isDragging } = this.props;

    let sandboxCount = sandboxes.length;

    this.isDragging = isDragging;
    this.selectedSandboxesObject = {};
    // Create an object to make it O(1)
    this.getSelectedSandboxIds().forEach(id => {
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
                      distanceInWordsToNow(rowData.updatedAt) + ' ago'
                    }
                    width={150}
                  />
                  <Column
                    label="Created"
                    dataKey="insertedAt"
                    cellDataGetter={({ rowData }) =>
                      distanceInWordsToNow(rowData.insertedAt) + ' ago'
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

export const SandboxGrid = SandboxGridComponent;
