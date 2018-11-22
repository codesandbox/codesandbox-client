import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding-left: 2rem;
`;

export const HeaderContainer = styled.div`
  position: relative;
  font-size: 1.25rem;
  color: white;

  @media (max-width: 768px) {
    margin-left: 1rem;
  }
`;

export const Description = styled.p`
  font-size: 1rem;
  width: 100%;
  font-weight: 600;
  color: ${props =>
    props.theme.light ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'};

  line-height: 1.6;

  @media (max-width: 768px) {
    margin-left: 1rem;
  }
`;

export const HeaderTitle = styled.div`
  display: flex;
  vertical-align: middle;
  align-items: center;
`;
