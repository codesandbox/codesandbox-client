import addons from '@storybook/addons';
import * as React from 'react';
import {
  branch,
  compose,
  lifecycle,
  mapProps,
  renderNothing,
  withHandlers,
  withState,
} from 'recompose';
import { ThemeProvider } from 'styled-components';

const BaseComponent = ({ theme, Provider, children }) => (
  <Provider theme={theme} children={children} />
);

export const ThemesProvider = compose(
  mapProps(props => {
    const { CustomThemeProvider } = props;
    const Provider = CustomThemeProvider ? CustomThemeProvider : ThemeProvider;
    return { ...props, Provider };
  }),
  withState('theme', 'setTheme', null),
  withHandlers({
    onSelectTheme: ({ setTheme, themes }) => name => {
      const theme = themes.find(th => th.name === name);
      setTheme(theme);
    },
  }),
  lifecycle({
    componentDidMount() {
      const { onSelectTheme, themes } = this.props;
      const channel = addons.getChannel();
      channel.on('selectTheme', onSelectTheme);
      channel.emit('setThemes', themes);
    },
    componentWillUnmount() {
      const { onSelectTheme } = this.props;
      const channel = addons.getChannel();
      channel.removeListener('selectTheme', onSelectTheme);
    },
  }),
  branch(props => !props.theme, renderNothing)
)(BaseComponent);
