import * as React from 'react';
import styled, { css } from 'styled-components';
import { sortBy, groupBy, flatten } from 'lodash';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import type { Module, Directory } from 'common/types';
import NotSyncedIcon from 'react-icons/lib/go/primitive-dot';

import { getModulePath } from 'app/store/entities/sandboxes/modules/selectors';
import Input from 'app/components/Input';

import EntryIcons from 'app/pages/Sandbox/Editor/Workspace/Files/DirectoryEntry/Entry/EntryIcons';
import getType from 'app/store/entities/sandboxes/modules/utils/get-type';

const Container = styled.div`
  position: absolute;

  top: 0;
  left: 0;
  right: 0;

  z-index: 60;

  margin: auto;
  padding-bottom: 0.25rem;

  background-color: ${props => props.theme.background};

  max-width: 650px;
  width: 100%;

  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.6);
`;

const InputContainer = styled.div`
  padding: 0.5rem;
  input {
    width: 100%;
  }
`;

const Items = styled.div`
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
`;

const Entry = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  padding: 0.25rem 0.75rem;
  cursor: pointer;

  ${({ isNotSynced }) =>
    isNotSynced &&
    css`
      padding-left: 2rem;
    `};
  color: rgba(255, 255, 255, 0.8);

  ${({ isActive }) =>
    isActive &&
    css`
      background-color: ${props => props.theme.secondary.clearer(0.7)};
    `};
`;

const NotSyncedIconWithMargin = styled(NotSyncedIcon)`
  position: absolute;
  left: 0.75rem;
  top: 0;
  color: ${props => props.theme.templateColor || props.theme.secondary};
  vertical-align: middle;

  margin-top: 6px;
`;

const CurrentModuleText = styled.div`
  position: absolute;
  right: 0.75rem;
  font-weight: 500;
  color: ${props => props.theme.secondary};
`;

const Name = styled.span`
  margin: 0 0.5rem;
`;

const Path = styled.span`
  margin: 0 0.25rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
`;

type Props = {
  modules: Array<Module>,
  directories: Array<Directory>,
  setCurrentModule: (moduleId: string) => void,
  closeFuzzySearch: () => void,
  currentModuleId: string,
};

export default class FuzzySearch extends React.PureComponent<Props> {
  // This is a precached map of paths to module
  paths = {};

  componentWillMount() {
    const { modules, directories } = this.props;
    const modulePathData = modules.map(m => {
      const path = getModulePath(modules, directories, m.id);
      return {
        m,
        path,
        depth: path.split('/').length,
      };
    });

    const groupedPaths = groupBy(modulePathData, n => n.depth);
    const sortedPaths = Object.values(groupedPaths).map(group =>
      sortBy(group, n => n.path)
    );
    const flattenedPaths = flatten(sortedPaths);

    this.paths = flattenedPaths.reduce(
      (paths, { m, path }) => ({
        ...paths,
        [m.id]: { path: path.replace('/', ''), m },
      }),
      {}
    );
  }

  itemToString = m => (m ? m.path : '');

  getItems = (value = '') => {
    const pathArray = Object.keys(this.paths).map(id => this.paths[id]);

    return matchSorter(pathArray, value, { keys: ['path'] });
  };

  onChange = item => {
    this.props.setCurrentModule(item.m.id);
  };

  handleKeyUp = e => {
    if (e.keyCode === 27) {
      this.props.closeFuzzySearch();
    }
  };

  render() {
    const { currentModuleId } = this.props;
    return (
      <Container>
        <Downshift
          defaultHighlightedIndex={0}
          defaultIsOpen
          onChange={this.onChange}
          itemToString={this.itemToString}
        >
          {({
            getInputProps,
            getItemProps,
            selectedItem,
            inputValue,
            highlightedIndex,
          }) => (
            <div style={{ width: '100%' }}>
              <InputContainer>
                <Input
                  {...getInputProps({
                    innerRef: el => el && el.focus(),
                    onKeyUp: this.handleKeyUp,
                    // Timeout so the fuzzy handler can still select the module
                    onBlur: () => setTimeout(this.props.closeFuzzySearch, 100),
                  })}
                />
              </InputContainer>
              <Items>
                {this.getItems(inputValue).map((item, index) => (
                  <Entry
                    {...getItemProps({
                      item,
                      index,
                      isActive: highlightedIndex === index,
                      isSelected: selectedItem === item,
                    })}
                    key={item.m.id}
                    isNotSynced={item.m.isNotSynced}
                  >
                    {item.m.isNotSynced && <NotSyncedIconWithMargin />}
                    <EntryIcons
                      isNotSynced={item.m.isNotSynced}
                      type={getType(item.m.title, item.m.code)}
                      error={item.m.errors && item.m.errors.length > 0}
                    />
                    <Name>{item.m.title}</Name>
                    {item.m.title !== this.itemToString(item) && (
                      <Path>{this.itemToString(item)}</Path>
                    )}
                    {item.m.id === currentModuleId && (
                      <CurrentModuleText>currently opened</CurrentModuleText>
                    )}
                  </Entry>
                ))}
              </Items>
            </div>
          )}
        </Downshift>
      </Container>
    );
  }
}
