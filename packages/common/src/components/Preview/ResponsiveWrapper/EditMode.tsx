import { Button, Element, Stack, Text } from '@codesandbox/components';
import React, { useRef } from 'react';
import styled from 'styled-components';
import Highlight, { defaultProps } from 'prism-react-renderer';
import { makeTheme } from '../../../utils/makeTheme';
import { CloseIcon } from './Icons';
import { ResponsiveWrapperProps } from './types';

type EditPresetProps = {
  actions: ResponsiveWrapperProps['props']['actions'];
  theme: ResponsiveWrapperProps['props']['theme'];
  state: ResponsiveWrapperProps['props']['state'];
};

const Wrapper = styled(Element)`
  width: 100%;
  top: -50px;
  height: calc(100% + 50px) !important;

  pre {
    font-family: 'dm', menlo, monospace;
    font-size: 15px;
    white-space: pre-wrap;
    word-break: break-all;
    height: 100%;
  }

  pre:focus {
    outline: none;
  }
`;

const LineNumbers = styled(Element)<{ content: string }>`
  display: inline;
  &:before {
    content: '${props => props.content}';
    font-size: 13px;
    color: ${props => props.theme['sideBar.border']};
    user-select: none;
  }
`;

export const EditPresets = ({ theme, state, actions }: EditPresetProps) => {
  const newPresets = useRef();

  const savePresets = () => {
    if (!newPresets.current) return;

    // @ts-ignore
    const text = newPresets.current.textContent;

    try {
      const data = JSON.parse(text);
      actions.toggleEditPresets();
      actions.editPresets(data);
    } catch (e) {
      // aaaaa
    }
  };

  return (
    <Wrapper>
      <Stack as="header" justify="space-between" padding={4}>
        <Text size={4}>Edit Presets</Text>
        <Button onClick={actions.toggleEditPresets} variant="link" autoWidth>
          <CloseIcon color={theme['sideBar.foreground']} />
        </Button>
      </Stack>
      <Button onClick={savePresets}>Save New Presets</Button>
      <Highlight
        {...defaultProps}
        code={JSON.stringify(state.responsive.presets, null, 2)}
        language="json"
        // @ts-ignore
        theme={makeTheme(theme.vscodeTheme)}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <Element
            contentEditable
            ref={newPresets}
            as="pre"
            paddingX={4}
            paddingY={2}
            marginY={2}
            className={className}
            style={style}
          >
            {tokens.map((line, i) => (
              <Element {...getLineProps({ line, key: i })}>
                <LineNumbers paddingRight={3} content={i.toString()} />
                {line.map((token, key) => (
                  <Element as="span" {...getTokenProps({ token, key })} />
                ))}
              </Element>
            ))}
          </Element>
        )}
      </Highlight>
    </Wrapper>
  );
};
