import React from 'react';
import styled from 'styled-components';

const Header = styled.div`
  padding: 0.5rem 1rem 0 1rem;
`;

const Modal = styled.div`
  position: relative;
  overflow: hidden;
  padding: 1rem 0;
  color: ${props => props.theme.white}
`;

const Content = styled.div`
  padding: 1rem;
`;

const Title = ({ title }) => {
  if (!title) return null;
  return (
    <Header>
      <h1>{title}</h1>
    </Header>
  );
};
Title.propTypes = {
  title: React.PropTypes.string,
};

const BaseModal = ({ children, title }: { children: React.Element, title: ?string }) => (
  <Modal>
    <Title title={title} />
    <Content>
      {children}
    </Content>
  </Modal>
);

export default BaseModal;
