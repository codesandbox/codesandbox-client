import { List } from 'immutable';
import * as React from 'react';
import {
  branch,
  compose,
  lifecycle,
  renderNothing,
  withHandlers,
  withState,
} from 'recompose';
import styled from 'styled-components';

const BaseComponent = ({ onSelectTheme, themes, theme }) => (
  <FlexRow>
    {themes
      .map((th, i) => (
        <Button
          selected={th === theme}
          key={i}
          onClick={() => onSelectTheme(th)}
        >
          {th.name}
        </Button>
      ))
      .toArray()}
    <FillingDiv />
    <Border>|</Border>
  </FlexRow>
);

export const Themes = compose(
  withState('theme', 'setTheme', null),
  withState('themes', 'setThemes', List()),
  withHandlers({
    onSelectTheme: ({ channel, setTheme }) => theme => {
      setTheme(theme);
      channel.emit('selectTheme', theme.name);
    },
    onReceiveThemes: ({ setTheme, setThemes, channel }) => newThemes => {
      const themes = List(newThemes);
      setThemes(List(themes));
      if (themes.count() > 0) {
        const theme = themes.first();
        setTheme(theme);
        channel.emit('selectTheme', theme.name);
      }
    },
  }),
  lifecycle({
    componentDidMount() {
      const { channel, onReceiveThemes } = this.props;
      channel.on('setThemes', onReceiveThemes);
    },
    componentWillUnmount() {
      const { channel, onReceiveThemes } = this.props;
      channel.removeListener('setThemes', onReceiveThemes);
    },
  }),
  branch(({ active }) => !active, renderNothing)
)(BaseComponent);

const FlexRow = styled.div`
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 120px);
  grid-gap: 16px;
  position: relative !important;
  height: auto !important;
`;

const FillingDiv = styled.div`
  flex: 1;
`;

const Border = styled.div`
  font-size: 0;
`;

const Button = styled.button`
  color: #fff;
  background-color: ${({ selected }) => (selected ? '#0971f1' : '#242424')};
  display: inline-block;
  cursor: pointer;
  height: 24px;
  width: 100%;
  font-size: 11px;
  border: none;
  border-radius: 2px;
  transition: all ease-in;
  transition-duration: 75ms;
`;
