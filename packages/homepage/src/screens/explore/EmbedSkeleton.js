import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  height: 48px;
  min-height: 48px;

  width: 100%;
  background-color: ${props => props.theme.background};
`;

const NavigationBar = styled.div`
  height: 40px;
  min-height: 40px;
  width: 100%;
  background-color: #eee;
`;

const StatusBar = styled.div`
  height: 33px;
  min-height: 33px;
  width: 100%;
  background-color: ${props => props.theme.background4};
`;

export default ({ id, style }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
      zIndex: 10,
      ...style,
    }}
  >
    <Header />
    <NavigationBar />

    <div
      style={{
        position: 'relative',
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          backgroundImage: `url("https://codesandbox.io/api/v1/sandboxes/${id}/screenshot.png")`,
          backgroundRepeat: 'no-repeat',
          backgroundPositionX: 'center',
          backgroundSize: 'cover',
          transform: 'scale(1.025, 1.025)',
          width: '100%',
          height: '100%',
          filter: 'blur(2px)',
        }}
      />
    </div>
    <StatusBar />
  </div>
);
