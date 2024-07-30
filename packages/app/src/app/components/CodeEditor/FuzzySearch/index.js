import * as React from 'react';
import { sortBy, groupBy, flatten } from 'lodash-es';
import Downshift from 'downshift';
import matchSorter from 'match-sorter';
import { getModulePath } from '@codesandbox/common/lib/sandbox/modules';
import Input from '@codesandbox/common/lib/components/Input';
import { EntryIcons } from 'app/components/EntryIcons';
// eslint-disable-next-line import/extensions
import { getType } from 'app/utils/get-type.ts';
import { ESC } from '@codesandbox/common/lib/utils/keycodes';
import {
  Container,
  InputContainer,
  Items,
  Entry,
  NotSyncedIconWithMargin,
  CurrentModuleText,
  Name,
  Path,
} from './elements';

export default class FuzzySearch extends React.PureComponent {
  // This is a precached map of paths to module
  paths = {};

  UNSAFE_componentWillMount() {
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
    if (e.keyCode === ESC) {
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
                    ref: el => el && el.focus(),
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
                      type={getType(item.m.title)}
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
